
# DemocraticLegder

A monitoring and analytics platform designed to **track, analyze, and detect suspicious campaign finance transactions** using modern data infrastructure.

The system processes mobile money and banking transactions to detect patterns related to **campaign mobilization, vote buying, and abnormal financial activity**.

---

# System Architecture

The system ingests financial transaction data and processes it through analytics services.

```
M-Pesa / Bank Transactions
        ↓
     PostgreSQL
 (Primary Data Store)
        ↓
    Elasticsearch
 (Search & Analytics)
        ↓
  Analytics API Layer
        ↓
 Monitoring Dashboard
```

Technologies used:

* PostgreSQL
* Elasticsearch
* Node.js / Express
* REST APIs
* Data analytics dashboards

---

# Core Monitoring Features

## B2C Transaction Monitoring

Tracks **entity → citizen transfers**.

Key capabilities:

* Identify which entities are funding individuals
* Track **registered geographic locations**
* Monitor **amount limits**
* Detect unusual campaign distributions

---

## C2C Transaction Monitoring

Tracks **person → person transfers**.

Key capabilities:

* Identify **campaign mobilization networks**
* Detect **micro-transfers**
* Monitor **coordinated money movement**
* Detect possible **vote-buying patterns**

---

## Withdrawal Monitoring

Tracks **user → vendor cash withdrawals**.

Key capabilities:

* Detect **withdrawal locations**
* Monitor **spikes before elections**
* Identify **top vendors receiving funds**
* Detect suspicious cash-out behavior

---

# Advanced Analytics

The system uses **Elasticsearch aggregations** to detect suspicious financial patterns:

* Time-series transaction spikes
* Network transaction flows
* High-value anomaly detection
* Geographic distribution of funds

---

# Example Analytics Endpoints

```
GET /analytics/timeseries
GET /analytics/network
GET /analytics/anomalies
```

These endpoints provide insights into:

* transaction spikes
* mobilization networks
* abnormal financial behavior


# Project Goal

To provide **transparency and accountability in campaign financing** by enabling investigators and analysts to detect:

* suspicious campaign payments
* coordinated mobilization activity
* abnormal withdrawal behavior
* vote buying patterns

---

# License

This project is developed for the **Campaign Finance Watch Tool Hackathon**.

---

If you want, I can also generate a **much more impressive README (with architecture diagrams, badges, and screenshots)** that makes the repository look **10x more professional for judges and reviewers**.
