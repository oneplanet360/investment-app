# 09 - Agent

Agents act as the sales and marketing layer of the application.

## Key Capabilities
- **Team Building:** Agents can search for unassigned users and link them to their downline.
- **Hierarchy Limits:**
  - Levels 1, 2, and 3 can assign sub-agents.
  - Level 4 agents can assign investors.
- **Commissions:** Agents earn a percentage-based commission whenever a downstream investor allocates capital. Commissions flow up the chain to a maximum of 4 levels.
- **Withdrawals:** Agents withdraw from a separate `commissionBalance`, independent of the investor wallet.

## Visualization
Agents have access to a "Tree" view rendering their downline recursively up to 4 tiers deep.

## References
- See [10-business-rules.md](./10-business-rules.md) for the 4-tier commission logic.
