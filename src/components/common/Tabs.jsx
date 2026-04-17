const Tabs = ({ tabs, activeTab, onChange, accentColor = "bg-accent" }) => {
  return (
    <div className="flex space-x-2 p-1 bg-gray-100 rounded-full w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 md:px-6 py-2 text-xs md:text-sm font-medium rounded-full transition-all duration-300
            ${activeTab === tab.id 
              ? `${accentColor} text-white shadow-md` 
              : "text-gray-600 hover:bg-gray-200"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default Tabs
