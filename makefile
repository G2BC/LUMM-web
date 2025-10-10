APP ?= lumm-web
IMAGE ?= ghcr.io/g2bc/$(APP)
ART ?= artifacts
GIT_SHA := $(shell git rev-parse --short HEAD 2>/dev/null || echo local)
DATE := $(shell date +%F)

ensure-artifacts:
	@mkdir -p $(ART)

run-dev:
	docker compose -f docker-compose.dev.yml up --build

run-prod:
	docker compose -f docker-compose.prod.yml up -d

scan-fs: ensure-artifacts
	trivy fs . --scanners vuln,secret --severity MEDIUM,HIGH,CRITICAL \
	  --no-progress --exit-code 0 -f table -o $(ART)/trivy-fs.txt
	trivy fs . --scanners vuln,secret --severity MEDIUM,HIGH,CRITICAL \
	  --no-progress -f json -o $(ART)/trivy-fs.json
	trivy fs . --scanners secret --no-progress -f table -o $(ART)/trivy-secrets.txt || true

scan-image-local: ensure-artifacts
	docker build -t $(APP):dev .
	trivy image $(APP):dev --severity MEDIUM,HIGH,CRITICAL --ignore-unfixed \
	  --no-progress -f table -o $(ART)/trivy-image-local.txt
	trivy image $(APP):dev --no-progress -f json -o $(ART)/trivy-image-local.json || true

scan-image-remote: ensure-artifacts
	trivy image $(IMAGE):latest --severity MEDIUM,HIGH,CRITICAL --ignore-unfixed \
	  --no-progress -f table -o $(ART)/trivy-image.txt || true
	trivy image $(IMAGE):latest --no-progress -f json -o $(ART)/trivy-image.json || echo '{}' > $(ART)/trivy-image.json

epv-high-risk: ensure-artifacts
	jq '[.Results[].Vulnerabilities[]? | select(.Severity=="HIGH" or .Severity=="CRITICAL")] | length' \
	  $(ART)/trivy-image.json > $(ART)/epv.txt || echo 0 > $(ART)/epv.txt

epv-total: ensure-artifacts
	jq '[.Results[].Vulnerabilities[]? | select(.Severity=="MEDIUM" or .Severity=="HIGH" or .Severity=="CRITICAL")] | length' \
	  $(ART)/trivy-image.json > $(ART)/epv-total.txt || echo 0 > $(ART)/epv-total.txt

epv-csv: epv-high-risk epv-total
	@if [ ! -f $(ART)/epv.csv ]; then echo 'date,commit,epv_high,epv_total' > $(ART)/epv.csv; fi
	@printf '%s,%s,%s,%s\n' '$(DATE)' '$(GIT_SHA)' "$$(cat $(ART)/epv.txt)" "$$(cat $(ART)/epv-total.txt)" >> $(ART)/epv.csv

.PHONY: ensure-artifacts run-dev run-prod scan-fs scan-image-local scan-image-remote epv-high-risk epv-total epv-csv
