# Pool Default Initiative Phrases Persistence Decision

## Date

17 March 2026

## Decision

For the MVP, `Pool Default Initiative Phrases` should be persisted as a simple Pool-level field rather than a separate related table.

Recommended shape:

- a Pool-level JSON field such as `initiative_phrases`

This is the preferred persistence model for v1.

## Why This Is The Right MVP Choice

The feature is still in first validation stage.

Its goals are:

- prove usefulness
- remain transparent
- stay narrow in scope
- avoid unnecessary system weight

A Pool-level field best supports those goals.

## Why Not A Separate Table For MVP

A separate table such as:

- `pool_initiative_phrases`

would be more normalized, but it would also make the MVP heavier than it needs to be.

That would add:

- more persistence complexity
- more query complexity
- more copy/import/export complexity
- more maintenance burden before the concept is validated

For v1, that is not justified.

## Why A Pool-Level JSON Field Fits

This feature is:

- Pool-owned
- small in scale
- optional
- not yet used for advanced querying
- not yet used for Territory composition

That makes a compact Pool-level field a good fit.

The data is not currently expected to need:

- relational querying
- independent ordering across large sets
- separate lifecycle management
- cross-Pool references

So the simplest model is the most honest one for MVP.

## Recommended Stored Shape

Minimal stored structure:

- array of objects
- each object contains:
  - `id`
  - `text`

Example conceptual shape:

```json
[
  { "id": "init_1", "text": "clean 32x32 pixel art portrait" },
  { "id": "init_2", "text": "limited palette portrait sprite" }
]
```

## Scope Implications

This decision means the MVP implementation should:

- extend Pool types
- extend Pool store mapping
- include the field in import/export
- include the field in default Pool copy behavior

It should not:

- introduce a new related persistence table
- introduce Territory-level merging logic
- introduce prompt-engine-aware persistence behavior

## Future Revisit Condition

This decision should be revisited only if the feature grows beyond the MVP in one of these ways:

1. initiative phrases need richer metadata
2. initiative phrases need independent querying
3. Territories begin composing initiative phrases from multiple Pools
4. initiative phrases become large enough that Pool-level JSON becomes awkward

Until then, the Pool-level field should remain the default choice.

## Final Principle

For MVP, choose the persistence model that validates the concept with the least architectural weight.

For Pool Default Initiative Phrases, that means:

- Pool-level JSON field first
- normalized table only if later growth truly requires it
