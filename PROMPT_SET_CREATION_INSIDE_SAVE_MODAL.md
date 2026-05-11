# Prompt Set Creation Inside Save Modal

## Question

Should users be able to create a new Prompt Set directly inside the `Save Prompt` modal?

## Honest Short Answer

Yes, probably.

But only in a very lightweight way.

## Why This Matters

If Prompt Sets are useful at save time, then forcing the user to leave the save flow just to create one would add unnecessary friction.

That would weaken the whole idea.

The ideal behavior is:

- user realizes they want a new Prompt Set
- user creates it right there
- user saves the prompt into it immediately

That is much more natural.

## Why It Can Work

Prompt Sets are not supposed to be:

- a heavy management system
- a complex hierarchy
- a major independent workflow

So creating one should not require a separate whole page in the MVP.

If the Prompt Set model is simple enough, then save-time creation fits the feature well.

## Best MVP Shape

Inside `Save Prompt`, the `Prompt Set` field could work like this:

- dropdown/select of existing sets
- one lightweight option:
  - `Create new set`

If chosen, reveal a small inline area:

- `Set name`
- optional `Set description`

Then after creation:

- the new set becomes selected automatically
- the user saves the prompt as normal

This keeps the flow tight.

## What To Avoid

Do not make set creation inside the save modal feel like:

- opening another full modal
- a large management panel
- a nested admin workflow

That would make the save moment feel heavier than it should.

The save modal should remain primarily about:

- saving the current prompt

not:

- managing a whole prompt-library system

## Why This Is Better Than Separate Creation First

If users must first:

1. leave save flow
2. go somewhere else
3. create a Prompt Set
4. come back
5. save the prompt

then the feature becomes less usable in the exact moment it is most relevant.

That is bad for adoption.

## Best Product Reading

The save modal should support:

- lightweight set creation

The Prompts page should support:

- fuller set browsing and later management

That split feels right.

## Honest Conclusion

Yes:

- Prompt Set creation should probably be possible inside the `Save Prompt` modal

But:

- only as a small inline creation flow
- not as a large nested management experience

That is the cleanest MVP behavior.
