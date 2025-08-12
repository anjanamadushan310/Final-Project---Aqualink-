export default function Dashboard({ dashboardName }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-cyan-800">
        {dashboardName === "SHOP_OWNER"
          ? "Shop Owner Dashboard"
          : dashboardName === "FARM_OWNER"
          ? "Farm Owner Dashboard"
          : `${dashboardName} Dashboard`}
      </h1>
      <p className="text-gray-600">
        Dashboard page for {dashboardName}. 
      </p>
    </div>
  );
}
