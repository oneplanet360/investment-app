import AgentsTable from "../../../components/tables/agents-table";

export default function AllAgents() {
  return (
    <AgentsTable 
      title="All Agents" 
      filter={() => true} 
    />
  );
}
