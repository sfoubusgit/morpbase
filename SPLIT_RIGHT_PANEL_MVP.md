## Split Right Panel MVP

### Goal

Test whether the right side becomes meaningfully better when:

- the prompt stays visible
- prompt actions stay reachable
- support content becomes secondary

This MVP should validate the structural idea without turning into a big redesign.

## Core MVP Behavior

### Upper persistent zone

Contains:

- Prompt Preview
- Save Prompt
- Copy Prompt
- Edit Output
- Undo
- Clear
- Export Mode

Behavior:

- remains visible while the user works on the page
- acts as the primary right-side console

### Lower support zone

Contains:

- Workflow Context
- Prompt Sources
- Saved Prompts

Behavior:

- scrolls normally below the persistent prompt zone
- does not push the prompt out of view

## Scope Rules

### Include

- right-side structural split
- prompt-first hierarchy
- action controls kept with prompt
- support content moved into lower zone

### Do not include

- new modes
- new prompt logic
- Prompt Library feature changes
- Workflow Context redesign beyond placement
- large visual redesign unrelated to the split

## UX Intent

The user should feel:

- the prompt is always in sight
- the prompt is always actionable
- the lower material is helpful but not in the way

The right side should feel more like:

- a prompt workstation

and less like:

- a stacked utility column

## Desktop-First Behavior

This MVP should primarily target desktop.

Recommended behavior:

- the upper prompt zone is sticky
- the lower support zone sits below it in the same right column
- the page scrolls normally

## Mobile / Smaller Screens

For MVP:

- do not fully redesign mobile
- allow a simpler fallback where the layout becomes more linear

The important validation target is desktop workflow.

## Success Criteria

The MVP succeeds if:

1. the user no longer feels they are “losing” the prompt while working
2. save / copy feel reachable at all times
3. the right side feels calmer and more purposeful
4. support content still remains useful

## Failure Criteria

The MVP fails if:

1. the sticky zone becomes too tall or oppressive
2. the lower zone becomes awkward to reach
3. Saved Prompts become too buried to remain useful
4. the right side feels over-engineered

## Recommended Build Order

1. keep Prompt Preview + its controls as the sticky upper zone
2. move Workflow Context below it
3. keep Prompt Library below that
4. test the feel before doing any extra polish

## One-Line Conclusion

The Split Right Panel MVP should simply turn the prompt and its actions into a persistent upper console while moving workflow context and saved prompts into a lower support zone, so the right side becomes prompt-first without adding new complexity.
