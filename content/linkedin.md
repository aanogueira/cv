Andre Nogueira
Senior Platform Engineer at Mollie | Building Internal Developer Platforms at Scale | Go, Kubernetes, Cloud Infrastructure

---

## About

Platform engineering leader building developer-centric infrastructure at scale. At Mollie, I support 500+ engineers across 1000+ Kubernetes clusters, designing and maintaining the internal cloud platform that powers the company's infrastructure.

I build platforms that eliminate friction: a cloud abstraction layer for self-service infrastructure provisioning, an infrastructure oversight system for real-time visibility and automated remediation, and a permission management tool with full audit trails and SOC2 compliance. My work spans the full stack — from Terraform modules and service mesh (mTLS via Envoy) to developer portals (Backstage) and project lifecycle automation that reduced onboarding from days to 30 minutes.

Before Mollie, I migrated La Redoute's entire on-prem estate to GCP (700+ servers, 500+ engineers), built end-to-end fintech infrastructure at SteelEye with on-site banking integrations (UBS), and architected an internal developer platform at Truphone serving 300-400 engineers across ~300 Kubernetes clusters. I completed postgraduate coursework in Cybersecurity and Forensic Informatics.

I contribute upstream to the Terraform GCP provider and GCP Autoneg, write about infrastructure and tooling at techquests.dev, and author company-wide courses on Kubernetes and cloud infrastructure. I build open-source tools in Go and Rust — code search engines, CLI utilities, and developer productivity tools.

What drives me: making infrastructure invisible to developers. Self-service, automated, observable, and secure by default.

Open to Senior and Staff-level Platform Engineering roles.

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

Promoted twice in under 2 years. I build and maintain Mollie's internal cloud platform, supporting 500+ engineers across 1000+ Kubernetes clusters. My work focuses on eliminating friction, enabling self-service infrastructure, and hardening systems for compliance. Key contributions:

- Architected and maintained the company's cloud abstraction platform, managing 1000+ Kubernetes clusters and enabling self-service infrastructure provisioning for 500+ engineers, with Backstage-powered self-service interfaces.
- Designed a 3-component infrastructure oversight system (data collector, policy analyzer via OPA/Rego, automated action engine) providing real-time visibility and automated remediation across all infrastructure, with full observability.
- Built an audited, SOC2-compliant permission escalation system enabling temporary cross-system privilege escalation with full audit trails; investigated and hardened broader infrastructure for SOC2 compliance.
- Automated end-to-end project lifecycle (IAM, cluster provisioning, CI/CD, project scaffolding), reducing onboarding/offboarding from days to 30 minutes.
- Implemented full lifecycle certificate management with automated rotation and alerting.
- Deployed service-to-service mTLS via Envoy across all production workflows.
- Authored reusable Terraform modules; contributed mTLS support to the upstream GCP Terraform provider and GCP Autoneg.
- Author company-wide courses on the internal cloud platform and Kubernetes; active on-call rotation; mentor within 9-person platform team.

Skills: Go, Kubernetes, Terraform, GCP, ArgoCD, Helm, Docker, Envoy, Backstage, OPA/Rego, Vault, Prometheus, Grafana, OpenTelemetry

---

### SteelEye

**Site Reliability Engineer**

Oct 2021 - May 2023

Greater London, England, United Kingdom

Designed and built end-to-end infrastructure for a fintech startup across AWS and Azure, including data pipelines, observability, and compliance. Traveled on-site to banking clients (UBS) and co-led a distributed team of 6.

- Designed and built end-to-end infrastructure for a fintech startup across AWS and Azure; implemented data pipelines (Airflow, Prefect), Kafka, and Elasticsearch.
- Traveled on-site to banking clients (including UBS) for integration work under strict privacy constraints; drove SOC2, GDPR, and industry compliance certifications.
- Built CI/CD with GitHub Actions; deployed ELK and LGTM stacks for observability; managed certificate lifecycle and on-call.
- Co-led a distributed team of 6 (3 EU + 3 India) with engineering manager, owning system design and platform architecture.

Skills: AWS, Azure, Kubernetes, GitHub Actions, Kafka, Elasticsearch, Airflow, Prefect, SOC2, GDPR, ELK, LGTM

---

### Smart Consulting

**Consultant**

Oct 2020 - Sep 2021

Lisbon, Portugal

Consultant at Smart Consulting, embedded at Truphone to build security automation tooling and enhance CI/CD pipeline security.

### Truphone

**DevSecOps Engineer**

Oct 2020 - Sep 2021

Lisbon, Portugal

Architected an internal developer platform on AWS (EKS) serving 300-400 engineers across ~300 Kubernetes clusters. Led a sub-team of 3, building platform tooling in Go and TypeScript with full lifecycle security controls.

- Architected an internal developer platform on AWS (EKS) for a 7-person team serving 300-400 engineers across ~300 Kubernetes clusters, accelerating service bootstrapping and integration.
- Implemented full lifecycle security controls: code scanning (SonarQube), custom CI runners/controllers, image scanning, and audit trails via GitLab CI.
- Managed self-hosted Kafka and Spark clusters, Elasticsearch, API gateway configurations, and Keycloak identity provider.
- Led a sub-team of 3 developers; built Go and TypeScript platform tooling; coordinated design and implementation of platform features.

Skills: AWS, Azure, EKS, Kubernetes, Go, TypeScript, GitLab CI, Kafka, Elasticsearch, Spark, SonarQube, Keycloak, LGTM

---

### KCS iT

**Consultant**

Sep 2019 - Oct 2020

Leiria, Portugal

Consultant at KCS iT, embedded at La Redoute to support cloud migration and infrastructure modernization.

### La Redoute

**DevOps Engineer**

Sep 2019 - Oct 2020

Leiria, Portugal & Roubaix, France

Joined a newly formed cloud team (7 engineers) to migrate La Redoute's entire on-prem infrastructure to GCP, managing 700+ servers and building CI/CD, observability, and secrets management from scratch.

- Joined a newly formed cloud team (7 engineers) to migrate the company's entire on-prem infrastructure to GCP for 500+ engineers; managed 700+ Linux/Windows servers and legacy Puppet configurations.
- Built CI/CD platform from scratch (Jenkins, GitLab CI) with custom runners; authored Terraform modules for all infrastructure, permissions, and service provisioning.
- Self-hosted Kafka clusters, databases, and Kubernetes; created Helm charts and adapted Java workloads for cloud-native deployment.
- Deployed LGTM stack and Nagios for observability; implemented Vault for secrets management; built recovery automation tooling in Go, Python, and Bash.

Skills: GCP, Azure, Kubernetes, Terraform, Jenkins, GitLab CI, Puppet, Kafka, Vault, Helm, LGTM, Nagios, Go, Python, Bash, Linux
