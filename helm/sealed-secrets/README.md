# Sealed secrets — paradise-assistance

`secrets-dev.yaml` and `secrets-production.yaml` seal the server-side
secrets. They decrypt (via the sealed-secrets controller) into a `Secret`
named **`paradise-assistance-secrets`** in `paradise-assistance-<env>`,
consumed by `envFrom` in `helm/templates/deployment.yaml` and by the Postgres
Deployment/backup (`DB_PASSWORD`).

Keys sealed:

| Key | Notes |
|-----|-------|
| `DATABASE_URL` | `postgresql://paradise:<DB_PASSWORD>@paradise-assistance-postgres:5432/paradise_assistance?schema=public` |
| `DB_PASSWORD` | Postgres password — **must equal** the password inside `DATABASE_URL` |
| `SESSION_SECRET` | Session signing for `/admin` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed account — change the password from "Mon compte" once logged in |
| `SMTP_*` / `MAIL_FROM` | nodemailer — **not configured yet**, contact form emails won't send until set |
| `CLOUDINARY_URL` / `CLOUDINARY_FOLDER` | **not configured yet** — admin image/video uploads won't work until set |

Non-secret runtime env (`APP_ENV`, `PORT`, `PUBLIC_SITE_URL`, …) is in
`values-<env>.yaml`.

## Re-sealing / rotating a value

```bash
kubeseal --controller-namespace kube-system \
  --controller-name sealed-secrets-controller --fetch-cert > /tmp/ss-cert.pem

cat > /tmp/s.yaml <<'EOF'
apiVersion: v1
kind: Secret
metadata:
  name: paradise-assistance-secrets
  namespace: paradise-assistance-dev   # or paradise-assistance-production
type: Opaque
stringData:
  CLOUDINARY_URL: "cloudinary://<api_key>:<api_secret>@<cloud_name>"
  # ...only the keys you are (re)setting; kubeseal --merge-into to patch one
EOF

kubeseal --cert /tmp/ss-cert.pem \
  --format yaml --scope strict < /tmp/s.yaml > secrets-dev.yaml
shred -u /tmp/s.yaml
```

To patch a single key without re-sealing the rest:

```bash
kubeseal --cert /tmp/ss-cert.pem --scope strict \
  --merge-into secrets-dev.yaml < /tmp/one-key.yaml
```

The SealedSecret is **strict-scoped**: name + namespace are fixed. Renaming
either requires re-sealing.
