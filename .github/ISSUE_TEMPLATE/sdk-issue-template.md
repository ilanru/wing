name: SDK Issue
about: File an SDK issue
labels: ["sdk"]
body:
- type: dropdown
  id: area
  attributes:
    label: Which area?
    options:
      - SDK
      - Language
      - Console
  validations:
    required: true