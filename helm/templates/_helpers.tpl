{{/*
Expand the name of the chart.
*/}}
{{- define "seobuilder.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "seobuilder.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "seobuilder.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "seobuilder.labels" -}}
helm.sh/chart: {{ include "seobuilder.chart" . }}
{{ include "seobuilder.selectorLabels" . }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "seobuilder.selectorLabels" -}}
release: {{ .Release.Name }}
app.kubernetes.io/name: {{ include "seobuilder.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}


