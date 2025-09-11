import React, { useState, useEffect } from 'react';
import IndustrialStuffCard from './IndustrialStuffCard';
import SearchBar from './SearchBar';

const IndustrialSection = () => {
  const [industrialList, setIndustrialList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredIndustrial, setFilteredIndustrial] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8;

  useEffect(() => {
    fetchIndustrialData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredIndustrial(industrialList);
      setCurrentPage(1); // reset to first page on search clear or industrialList update
    } else {
      const filtered = industrialList.filter((industrial) =>
        industrial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        industrial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        industrial.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredIndustrial(filtered);
      setCurrentPage(1); // reset to first page on filtering
    }
  }, [searchQuery, industrialList]);

  const fetchIndustrialData = async () => {
    try {
      //const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/industrial', {
        //headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();
      setIndustrialList(data);
      setFilteredIndustrial(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching industrial data:', error);
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(filteredIndustrial.length / cardsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Get the industrial stuff cards for the current page
  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentCards = filteredIndustrial.slice(startIndex, startIndex + cardsPerPage);

  if (loading) {
    return (
      <section className="mb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading fish supplies...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-20 px-2 sm:px-2 lg:px-2">
      <div className=" mb-12">
        <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Fish Supplies & Equipment
        </h3>
      </div>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search for fish supplies, tanks, food, chemicals..."
      />

      {filteredIndustrial.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🐠</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No fish supplies found</h3>
          <p className="text-gray-500">
            {searchQuery ? 'Try adjusting your search terms' : 'No fish supplies available at the moment'}
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-full border border-gray-300 ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
              }`}
              aria-label="Previous"
            >
              &#8592;
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full border border-gray-300 ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
              }`}
              aria-label="Next"
            >
              &#8594;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {currentCards.map((industrial) => (
              <IndustrialStuffCard key={industrial.id} industrial={industrial} onPurchaseSuccess={fetchIndustrialData} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default IndustrialSection;
