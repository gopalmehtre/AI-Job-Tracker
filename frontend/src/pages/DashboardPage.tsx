import Header from "../components/layout/Header";
import KanbanBoard from "../components/board/KanbanBoard";

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <KanbanBoard />
    </div>
  );
};

export default DashboardPage;
