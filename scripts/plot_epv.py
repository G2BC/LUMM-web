import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import json
import os

path_image = "artifacts/trivy-image.json"
path_fs = "artifacts/trivy-fs.json"
path_config = "artifacts/trivy-config.json"
os.makedirs("reports", exist_ok=True)

def count_by_severity(trivy_json):
    severities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    counts = {s: 0 for s in severities}
    if "Results" in trivy_json:
        for res in trivy_json["Results"]:
            for v in res.get("Vulnerabilities") or []:
                sev = v.get("Severity")
                if sev in counts:
                    counts[sev] += 1
            for m in res.get("Misconfigurations") or []:
                sev = m.get("Severity")
                if sev in counts:
                    counts[sev] += 1
    return counts

def load_json_or_empty(path):
    if os.path.isfile(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

img = load_json_or_empty(path_image)
fs = load_json_or_empty(path_fs)
cfg = load_json_or_empty(path_config)

sev_img = count_by_severity(img)
sev_fs = count_by_severity(fs)
sev_cfg = count_by_severity(cfg)

df = pd.DataFrame([
    {"categoria": "imagem", "severidade": k, "contagem": v} for k, v in sev_img.items()
] + [
    {"categoria": "fs", "severidade": k, "contagem": v} for k, v in sev_fs.items()
] + [
    {"categoria": "config", "severidade": k, "contagem": v} for k, v in sev_cfg.items()
])

plt.figure(figsize=(10, 6))
sns.barplot(data=df, x="categoria", y="contagem", hue="severidade")
plt.title("Vulnerabilidades por categoria e severidade")
plt.ylabel("Quantidade")
plt.xlabel("Categoria")
plt.tight_layout()
plt.savefig("artifacts/epv_categoria_severidade.png")
plt.close()

df_total = df.groupby("severidade")["contagem"].sum().reset_index()
plt.figure(figsize=(8, 5))
sns.barplot(data=df_total, x="severidade", y="contagem")
plt.title("Vulnerabilidades totais por severidade")
plt.tight_layout()
plt.savefig("artifacts/epv_por_severidade.png")
plt.close()

count_image = sum(sev_img[s] for s in ["MEDIUM", "HIGH", "CRITICAL"])
count_fs = sum(sev_fs[s] for s in ["MEDIUM", "HIGH", "CRITICAL"])
count_cfg = sum(sev_cfg[s] for s in ["MEDIUM", "HIGH", "CRITICAL"])

df2 = pd.DataFrame({
    "categoria": ["imagem", "fs", "config"],
    "contagem": [count_image, count_fs, count_cfg]
})
plt.figure(figsize=(8, 5))
sns.barplot(data=df2, x="categoria", y="contagem")
plt.title("Contagem de vulnerabilidades por categoria (M/H/C)")
plt.tight_layout()
plt.savefig("artifacts/epv_por_categoria.png")
plt.close()

total = count_image + count_fs + count_cfg
df3 = pd.DataFrame({
    "tipo": ["imagem", "fs", "config", "total"],
    "contagem": [count_image, count_fs, count_cfg, total]
})
plt.figure(figsize=(8, 5))
sns.barplot(data=df3, x="tipo", y="contagem")
plt.title("Vulnerabilidades totais + por categoria (M/H/C)")
plt.tight_layout()
plt.savefig("artifacts/epv_total_completo.png")
plt.close()
