import React, { useState, useEffect } from 'react';
import DistrictSelector from './DistrictSelector';

const CoverageAreaManagement = () => {
  const [coverageData, setCoverageData] = useState({});
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);

  // ALL SRI LANKAN PROVINCES AND DISTRICTS WITH TOWNS
  const sriLankanDistricts = {
    'Western': {
      'Colombo': ['Colombo 01', 'Colombo 02', 'Colombo 03', 'Colombo 04', 'Colombo 05', 'Colombo 06', 'Colombo 07', 'Colombo 08', 'Colombo 09', 'Colombo 10', 'Colombo 11', 'Colombo 12', 'Colombo 13', 'Colombo 14', 'Colombo 15', 'Dehiwala', 'Mount Lavinia', 'Moratuwa', 'Piliyandala', 'Kesbewa', 'Maharagama', 'Kotte', 'Battaramulla', 'Rajagiriya'],
      'Gampaha': ['Gampaha', 'Negombo', 'Katunayake', 'Wattala', 'Ja-Ela', 'Kandana', 'Ragama', 'Kiribathgoda', 'Kelaniya', 'Peliyagoda', 'Kadawatha', 'Mirigama', 'Minuwangoda', 'Divulapitiya', 'Nittambuwa', 'Veyangoda'],
      'Kalutara': ['Kalutara', 'Panadura', 'Horana', 'Matugama', 'Beruwala', 'Aluthgama', 'Bentota', 'Wadduwa', 'Bandaragama', 'Ingiriya', 'Bulathsinhala']
    },
    'Central': {
      'Kandy': ['Kandy', 'Peradeniya', 'Gampola', 'Nawalapitiya', 'Wattegama', 'Harispattuwa', 'Pathadumbara', 'Akurana', 'Kadugannawa', 'Pilimatalawa'],
      'Matale': ['Matale', 'Dambulla', 'Sigiriya', 'Naula', 'Ukuwela', 'Rattota', 'Pallepola', 'Galewela'],
      'Nuwara Eliya': ['Nuwara Eliya', 'Hatton', 'Talawakele', 'Nanu Oya', 'Maskeliya', 'Bogawantalawa', 'Kotagala', 'Ginigathhena']
    },
    'Southern': {
      'Galle': ['Galle', 'Hikkaduwa', 'Ambalangoda', 'Elpitiya', 'Bentota', 'Baddegama', 'Yakkalamulla', 'Neluwa', 'Nagoda', 'Imaduwa'],
      'Matara': ['Matara', 'Weligama', 'Mirissa', 'Dikwella', 'Tangalle', 'Kamburupitiya', 'Akuressa', 'Hakmana', 'Kotapola'],
      'Hambantota': ['Hambantota', 'Tissamaharama', 'Kataragama', 'Tangalle', 'Ambalantota', 'Beliatta', 'Weeraketiya', 'Suriyawewa']
    },
    'Northern': {
      'Jaffna': ['Jaffna', 'Nallur', 'Chavakachcheri', 'Point Pedro', 'Karainagar', 'Velanai', 'Kayts', 'Delft'],
      'Kilinochchi': ['Kilinochchi', 'Pallai', 'Paranthan', 'Poonakary'],
      'Mannar': ['Mannar', 'Nanattan', 'Madhu', 'Pesalai', 'Erukkalampiddy'],
      'Vavuniya': ['Vavuniya', 'Nedunkeni', 'Settikulam', 'Omanthai', 'Puliyankulam'],
      'Mullaitivu': ['Mullaitivu', 'Oddusuddan', 'Puthukudiyiruppu', 'Weli Oya', 'Manthai East']
    },
    'Eastern': {
      'Trincomalee': ['Trincomalee', 'Kinniya', 'Mutur', 'Kuchchaveli', 'Nilaveli', 'Uppuveli', 'Kantalai'],
      'Batticaloa': ['Batticaloa', 'Kalkudah', 'Passikudah', 'Valachchenai', 'Eravur', 'Oddamavadi', 'Chenkaladi'],
      'Ampara': ['Ampara', 'Akkaraipattu', 'Kalmunai', 'Sammanthurai', 'Pottuvil', 'Uhana', 'Damana', 'Mahaoya', 'Padiyathalawa']
    },
    'North Western': {
      'Kurunegala': ['Kurunegala', 'Puttalam', 'Chilaw', 'Kuliyapitiya', 'Narammala', 'Wariyapola', 'Pannala', 'Melsiripura', 'Bingiriya'],
      'Puttalam': ['Puttalam', 'Chilaw', 'Nattandiya', 'Wennappuwa', 'Marawila', 'Dankotuwa', 'Anamaduwa', 'Karuwalagaswewa']
    },
    'North Central': {
      'Anuradhapura': ['Anuradhapura', 'Kekirawa', 'Tambuttegama', 'Eppawala', 'Medawachchiya', 'Rambewa', 'Galenbindunuwewa', 'Mihintale'],
      'Polonnaruwa': ['Polonnaruwa', 'Kaduruwela', 'Medirigiriya', 'Hingurakgoda', 'Dimbulagala', 'Welikanda', 'Lankapura']
    },
    'Uva': {
      'Badulla': ['Badulla', 'Bandarawela', 'Ella', 'Haputale', 'Welimada', 'Diyatalawa', 'Hali Ela', 'Demodara', 'Passara'],
      'Monaragala': ['Monaragala', 'Wellawaya', 'Kataragama', 'Buttala', 'Bibile', 'Medagama', 'Siyambalanduwa']
    },
    'Sabaragamuwa': {
      'Ratnapura': ['Ratnapura', 'Embilipitiya', 'Balangoda', 'Pelmadulla', 'Eheliyagoda', 'Kuruwita', 'Godakawela', 'Kalawana'],
      'Kegalle': ['Kegalle', 'Mawanella', 'Warakapola', 'Rambukkana', 'Galigamuwa', 'Yatiyantota', 'Ruwanwella', 'Deraniyagala']
    }
  };

  // Mock coverage data
  const mockCoverageData = {
    selectedDistricts: ['Colombo', 'Gampaha'],
    selectedTowns: {
      'Colombo': ['Colombo 01', 'Colombo 02', 'Dehiwala'],
      'Gampaha': ['Negombo', 'Katunayake']
    }
  };

  const mockAvailability = {
    isAvailable: true
  };

  useEffect(() => {
    setTimeout(() => {
      setCoverageData(mockCoverageData);
      setAvailability(mockAvailability);
      setLoading(false);
    }, 1000);
  }, []);

  const updateCoverageData = (newData) => {
    setCoverageData(prev => ({ ...prev, ...newData }));
  };

  const toggleAvailability = () => {
    setAvailability(prev => ({ ...prev, isAvailable: !prev.isAvailable }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading coverage settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Coverage Area Management</h1>
              <p className="text-gray-600">Configure your service areas and availability</p>
            </div>
            
            {/* Simple Stats */}
            <div className="grid grid-cols-2 gap-4 mt-4 lg:mt-0">
              <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                <div className="text-2xl font-bold text-blue-800">{coverageData.selectedDistricts?.length || 0}</div>
                <div className="text-xs text-blue-600">Districts</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-2xl font-bold text-green-800">
                  {Object.values(coverageData.selectedTowns || {}).flat().length || 0}
                </div>
                <div className="text-xs text-green-600">Towns</div>
              </div>
            </div>
          </div>
        </div>

        {/* AVAILABILITY TOGGLE - NO STATUS TEXT */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Service Availability</h3>
              <p className="text-gray-600 mt-1">Toggle your availability for new delivery requests</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={availability.isAvailable}
                onChange={toggleAvailability}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {availability.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </label>
          </div>
        </div>

        {/* ONLY DISTRICT SELECTOR */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Service Areas</h3>
            <p className="text-gray-600">Select the districts and towns you want to serve</p>
          </div>
          
          <div className="p-6">
            <DistrictSelector
              districts={sriLankanDistricts}
              coverageData={coverageData}
              onUpdate={updateCoverageData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverageAreaManagement;
