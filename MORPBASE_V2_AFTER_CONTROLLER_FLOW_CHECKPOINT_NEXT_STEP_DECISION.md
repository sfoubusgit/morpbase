# MorpBase V2 After Controller Flow Checkpoint Next Step Decision

Next move:
- `behavior safety-net planning`

Why:
- the controller baseline is now healthy enough
- the project has no test layer yet
- the next real risk is behavior drift, not file structure

What this should cover:
- what behavior matters most to protect first
- what can be checked with pure function tests
- what needs lightweight app-level smoke coverage
- what can stay manual for now

What not to do next:
- do not keep refactoring controller flow by momentum
