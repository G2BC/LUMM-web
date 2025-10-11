import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import json
import os

path_image = "artifacts/trivy-image.json"
path_fs = "artifacts/trivy-fs.json"
path_config = "artifacts/trivy-config.json"

def count_vulns(trivy_json, severities=None):
    total = 0
    if not trivy_json:
        return 0
    if "Results" in trivy_json:
        for res in trivy_json["Results"]:
            for v in res.get("Vulnerabilities") or []:
                if severities is None or v.get("Severity") in severities:
                    total += 1
            for m in res.get("Misconfigurations") or []:
                if severities is None or m.get("Severity") in severities:
                    total += 1
    return total

def load_json_or_empty(path):
    if os.path.isfile(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

img = load_json_or_empty(path_image)
fs = load_json_or_empty(path_fs)
cfg = load_json_or_empty(path_config)

count_image = count_vulns(img, severities=["MEDIUM", "HIGH", "CRITICAL"])
count_fs = count_vulns(fs, severities=["MEDIUM", "HIGH", "CRITICAL"])
count_cfg = count_vulns(cfg, severities=["MEDIUM", "HIGH", "CRITICAL"])

df = pd.DataFrame({
    "categoria": ["imagem", "fs", "config"],
    "contagem": [count_image, count_fs, count_cfg]
})
plt.figure(figsize=(8, 5))
sns.barplot(data=df, x="categoria", y="contagem")
plt.title("Contagem de vulnerabilidades por categoria")
plt.ylabel("Número de vulnerabilidades")
plt.xlabel("Categoria (Imagem / Código / Configuração)")
plt.tight_layout()
plt.savefig("artifacts/epv_por_categoria.png")
plt.close()

total = count_image + count_fs + count_cfg
df2 = pd.DataFrame({
    "tipo": ["imagem", "fs", "config", "total"],
    "contagem": [count_image, count_fs, count_cfg, total]
})
plt.figure(figsize=(8, 5))
sns.barplot(data=df2, x="tipo", y="contagem")
plt.title("Vulnerabilidades totais + por categoria")
plt.ylabel("Número de vulnerabilidades")
plt.xlabel("Tipo")
plt.tight_layout()
plt.savefig("artifacts/epv_total_completo.png")
plt.close()
