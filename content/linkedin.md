André Nogueira
Senior Platform Engineer at Mollie | Internal Developer Platforms, Kubernetes, GCP | Turning infrastructure into products engineers build on

---

## About

I'm a platform engineer with 7+ years building internal developer platforms on GCP, AWS and Azure, most recently in regulated payments at Mollie, where I've been promoted twice in under two years. I find the problems slowing engineering teams down, write the design, align the teams involved, and carry the fix to a company-wide standard.

Recent work: a deployment standard adopted across 40+ product repos; a private PKI that protected bank and payment-partner mTLS through a public CA change and a hard compliance deadline; self-service tooling that cut project setup from days to 30 minutes across a 300+ cluster estate; and internal courses that have trained 180+ engineers.

Before Mollie I built platforms in fintech (SteelEye), telecom (Truphone) and retail (La Redoute). Outside work I build open source tools, including houndr, a Rust code search engine, contribute upstream to the GCP Terraform provider, and write at techquests.dev.

---

## Experience

### Mollie

Full-time

Lisbon, Portugal

**Senior Platform Engineer**
Jan 2025 - Present

**Platform Engineer II**
Jan 2024 - Dec 2024

**Platform Engineer I**
May 2023 - Dec 2023

Promoted twice in under 2 years, on a 9-person platform team. Key contributions:

- Deployment standard: Standardized deployments across 40+ product repos by creating the shared Helm chart and leading the migrations, now the default for all Java, PHP and Go services.
- Partner mTLS: Protected bank and payment-partner mTLS when a public CA ended client-auth certificates under a fixed compliance deadline. Worked with Security and Risk to ship a private PKI on GCP Certificate Authority Service that avoided the cliff and is now the partner mTLS standard.
- Service-to-service traffic: Initiated and led the move of internal traffic to one identity-authenticated, cross-region path (Envoy, IAP), onboarding 35+ projects, and wrote the service mesh assessment comparing four mesh options against live data from 300+ clusters.
- Self-serve platform: Removed the platform team as a bottleneck by proposing and co-building self-service project onboarding and teardown in Go, cutting setup from days to 30 minutes; teams now create and retire ~100 projects a year themselves.
- Point-of-sale launch: Enabled payment terminals to authenticate directly to the backend for a new in-person payments product, owning the edge mTLS design, a custom API gateway plugin and its test matrix from proof of concept to an on-time launch.
- Technical direction: Authored 10+ architecture decision records shaping the network and edge roadmap, plus a proposed multi-region network design now in cross-team review.
- Security and governance: Replaced standing admin access with audited just-in-time privilege escalation, and built a policy engine (OPA/Rego) that continuously checks infrastructure and remediates drift, supporting SOC2.
- Reliability: Wrote the regional switchover runbooks and built a self-service failover drill.
- Multiplier: Designed the internal Kubernetes and platform courses (180+ engineers trained) and coached 3 engineers into owning core platform tools.

Skills: Kubernetes, GKE, Terraform, Helm, Envoy, GCP, Backstage, OPA/Rego, PKI, mTLS, Go, Argo CD, Prometheus, Grafana, Datadog, OpenTelemetry

---

### SteelEye

**Site Reliability Engineer**

Oct 2021 - May 2023

Greater London, England, United Kingdom

Owned infrastructure end to end for a fintech startup selling to banks, and co-led a distributed team of 6.

- Owned infrastructure end to end on AWS and Azure: data pipelines (Airflow, Prefect), Kafka, Elasticsearch, CI/CD and observability.
- Co-led a distributed team of 6 across the EU and India with the engineering manager, owning system design and platform architecture.
- Drove the SOC2 and GDPR certifications banking clients required, including on-site integration work with banks under strict privacy constraints.

Skills: AWS, Azure, Kubernetes, GitHub Actions, Kafka, Elasticsearch, Airflow, Prefect, SOC2, GDPR, ELK, LGTM

---

### Smart Consulting

**Consultant**

Oct 2020 - Sep 2021

Lisbon, Portugal

Consultant at Smart Consulting, embedded at Truphone to build its internal developer platform and secure its delivery pipelines.

### Truphone

**DevSecOps Engineer**

Oct 2020 - Sep 2021

Lisbon, Portugal

Designed the internal developer platform on AWS EKS for 300+ engineers, and led a sub-team building its tooling.

- Designed the internal developer platform on AWS EKS that let 300+ engineers across ~300 Kubernetes clusters bootstrap services without waiting on operations.
- Built security into delivery: code and image scanning, custom CI runners, and GitLab CI audit trails.
- Led a sub-team of 3 building the platform tooling in Go and TypeScript.

Skills: AWS, EKS, Kubernetes, Go, TypeScript, GitLab CI, Kafka, Elasticsearch, Spark, SonarQube, Keycloak

---

### KCS iT

**Consultant**

Sep 2019 - Oct 2020

Leiria, Portugal

Consultant at KCS iT, embedded at La Redoute to migrate its on-prem estate to GCP.

### La Redoute

**DevOps Engineer**

Sep 2019 - Oct 2020

Leiria, Portugal & Roubaix, France

Early member of a new cloud team that moved the company's on-prem estate to GCP.

- Early member of a new 7-person cloud team that migrated 700+ on-prem servers to GCP for 500+ engineers.
- Built CI/CD from scratch and the Terraform modules for infrastructure, permissions and provisioning, replacing infrastructure tickets with code.
- Introduced Vault for secrets management and the Grafana LGTM stack for observability.

Skills: GCP, Kubernetes, Terraform, Jenkins, GitLab CI, Puppet, Kafka, Vault, Helm, LGTM, Go, Python, Bash, Linux

---

### BipBip

**Co-Founder**

Side Project

2019 - 2020

Lisbon, Portugal

Co-founded a logistics startup connecting transportation companies with businesses needing delivery.

- Built the first demo and the demand-matching algorithm behind it.
- Incubated at Startup Leiria; won the mobility category prize at Startup Lisboa.

Skills: Product Development, Algorithm Design, Startup Strategy
