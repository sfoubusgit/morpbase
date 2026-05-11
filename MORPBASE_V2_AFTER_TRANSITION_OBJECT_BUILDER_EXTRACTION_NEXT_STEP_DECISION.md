# MorpBase V2 After Transition Object-Builder Extraction Next Step Decision

Next move:
- `controller flow checkpoint`

Why:
- the realm views are out
- the controller effects are out
- the transition builders are out
- the remaining controller density is now mostly visible action flow and message/origin sequencing

Healthy question:
- is that remaining flow now clear enough to keep as the stable controller baseline
- or is there one more bounded helper layer worth extracting

What not to do:
- do not keep extracting just because `App.tsx` still has handlers
- do not hide the real app behavior behind too many helper files
