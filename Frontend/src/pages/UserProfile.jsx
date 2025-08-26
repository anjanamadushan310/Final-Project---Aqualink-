import React, { useState, useEffect } from 'react';
import axios from 'axios';

const sriLankanDistricts = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle",
    "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle",
    "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala",
    "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura",
    "Trincomalee", "Vavuniya"
];

const districtToTowns = {
    "Ampara": [
        "Ampara", "Akkaraipattu", "Kalmunai", "Sammanthurai", "Uhana", "Mahaoya", "Damana", "Lahugala",
        "Addalachchenai", "Thirukkovil", "Pottuvil", "Arugam Bay", "Komari", "Navithanveli", "Padiyathalawa",
        "Maha Oya", "Digamadulla", "Dehiattakandiya", "Ampara Town", "Sainthamaruthu", "Nindavur",
        "Kondavil", "Kiran", "Maharagama", "Rugam", "Panama", "Oluvil"
    ],
    "Anuradhapura": [
        "Anuradhapura", "Kekirawa", "Thambuttegama", "Eppawala", "Galenbindunuwewa", "Mihintale", "Medawachchiya", "Rambewa",
        "Tambuttegama", "Horowpothana", "Kahatagasdigiliya", "Rajanganaya", "Palugaswewa", "Galnewa", "Palagala",
        "Tirappane", "Nochchiyagama", "Maradankadawala", "Talawa", "Ipalogama", "Nachchaduwa", "Kebithigollewa",
        "Padaviya", "Galkadawala", "Bogahawewa", "Thirappane", "Habarana", "Iranmadu"
    ],
    "Badulla": [
        "Badulla", "Bandarawela", "Ella", "Haputale", "Welimada", "Mahiyanganaya", "Passara", "Hali Ela",
        "Diyathalawa", "Demodara", "Kandapola", "Namunukula", "Soranathota", "Haputhale", "Idalgashinna",
        "Ohiya", "Ambewela", "Poonagala", "Haldummulla", "Lunugala", "Rideegama", "Meegahakivula",
        "Uva Paranagama", "Ella Gap", "Badulla Town", "Kinchigune", "Keppetipola", "Bellhuloya"
    ],
    "Batticaloa": [
        "Batticaloa", "Kattankudy", "Eravur", "Valachchenai", "Chenkalady", "Oddamavadi", "Kaluwanchikudy",
        "Kiran", "Manmunai North", "Manmunai South", "Manmunai Pattu", "Koralaipattu North", "Koralaipattu",
        "Porativu Pattu", "Unnichchai", "Paddippalai", "Kalkudah", "Passikudah", "Kokkaddicholai",
        "Araipattai", "Vellaveli", "Amirabad", "Navatkadu", "Kodukamam", "Mahiladithivu", "Kirimechchiya"
    ],
    "Colombo": [
        "Colombo", "Sri Jayawardenepura Kotte", "Dehiwala-Mount Lavinia", "Moratuwa", "Kesbewa", "Maharagama", "Kotikawatta", "Mulleriyawa",
        "Rajagiriya", "Battaramulla", "Kottawa", "Pannipitiya", "Homagama", "Padukka", "Hanwella", "Avissawella",
        "Nugegoda", "Boralesgamuwa", "Piliyandala", "Kelaniya", "Wattala", "Ja-Ela", "Kandana", "Negombo",
        "Katunayake", "Seeduwa", "Minuwangoda", "Gampaha", "Veyangoda", "Mirigama", "Kirindiwela", "Dompe",
        "Kadawatha", "Ragama", "Kiribathgoda", "Delkanda", "Wellampitiya", "Kolonnawa", "Kotte", "Malabe",
        "Athurugiriya", "Thalawathugoda", "Godagama", "Rathmalana", "Kalubowila", "Rawathawatte"
    ],
    "Galle": [
        "Galle", "Hikkaduwa", "Ambalangoda", "Bentota", "Elpitiya", "Karapitiya", "Baddegama", "Yakkalamulla",
        "Unawatuna", "Kosgoda", "Balapitiya", "Ahungalla", "Induruwa", "Aluthgama", "Beruwala", "Dodanduwa",
        "Habaraduwa", "Talpe", "Weligama", "Mirissa", "Matara", "Kamburugamuwa", "Neluwa", "Nagoda",
        "Pitigala", "Imaduwa", "Thawalama", "Wanduramba", "Akmeemana"
    ],
    "Gampaha": [
        "Gampaha", "Negombo", "Katunayake", "Wattala", "Kelaniya", "Peliyagoda", "Ja-Ela", "Kandana", "Minuwangoda", "Divulapitiya",
        "Seeduwa", "Liyanagemulla", "Kochchikade", "Marawila", "Chilaw", "Nattandiya", "Dankotuwa", "Wennappuwa",
        "Veyangoda", "Mirigama", "Kirindiwela", "Dompe", "Kadawatha", "Ragama", "Kiribathgoda", "Attanagalla",
        "Biyagama", "Mahara", "Weliweriya", "Ganemulla", "Yakkala", "Nittambuwa", "Pugoda"
    ],
    "Hambantota": [
        "Hambantota", "Tangalle", "Tissamaharama", "Ambalantota", "Beliatta", "Weeraketiya", "Suriyawewa", "Kataragama",
        "Mattala", "Kirinda", "Yala", "Bundala", "Sooriyawewa", "Lunugamvehera", "Ranna", "Rekawa",
        "Palatupana", "Wirawila", "Angunukolapelessa", "Embilipitiya", "Middeniya", "Okewela", "Walasmulla",
        "Ambalantota Town", "Nonagama", "Gonnoruwa", "Ridiyagama"
    ],
    "Jaffna": [
        "Jaffna", "Nallur", "Chavakachcheri", "Point Pedro", "Karainagar", "Velanai", "Kayts", "Delft",
        "Kopay", "Kondavil", "Tellippalai", "Sandilipay", "Uduvil", "Manipay", "Atchuvely", "Ariyalai",
        "Palaly", "Kankesanturai", "Valikamam", "Thenmaradchy", "Vadamaradchy", "Pachchilaipalli",
        "Karaveddy", "Nelliady", "Chankanai", "Maruthankerny", "Puttur", "Thondaimanaru"
    ],
    "Kalutara": [
        "Kalutara", "Panadura", "Horana", "Beruwala", "Aluthgama", "Matugama", "Bandaragama", "Ingiriya",
        "Wadduwa", "Payagala", "Maggona", "Bulathsinhala", "Palindanuwara", "Agalawatta", "Mathugama",
        "Dharga Town", "Kalutara South", "Kalutara North", "Katukurunda", "Waskaduwa", "Bentota",
        "Kosgama", "Millewa", "Dodangoda", "Welegoda"
    ],
    "Kandy": [
        "Kandy", "Gampola", "Nawalapitiya", "Wattegama", "Kadugannawa", "Peradeniya", "Katugastota", "Akurana",
        "Digana", "Teldeniya", "Kundasale", "Deltota", "Harispattuwa", "Hataraliyadda", "Medadumbara",
        "Panvila", "Pasbage", "Pathadumbara", "Patha Hewaheta", "Pilimathalawa", "Poojapitiya", "Tumpane",
        "Udadumbara", "Udapalatha", "Udunuwara", "Yatinuwara", "Doluwa", "Gangawata Korale"
    ],
    "Kegalle": [
        "Kegalle", "Mawanella", "Warakapola", "Rambukkana", "Galigamuwa", "Yatiyantota", "Dehiowita", "Ruwanwella",
        "Kitulgala", "Aranayaka", "Bulathkohupitiya", "Deraniyagala", "Kuruppuarachchi", "Polgampola",
        "Ruwanwella Town", "Kegalle Town", "Avissawella", "Ratnapura", "Pelmadulla"
    ],
    "Kilinochchi": [
        "Kilinochchi", "Paranthan", "Poonakary", "Pallai", "Kandavalai",
        "Akkarayankulam", "Paranthan Junction", "Elephant Pass", "Muhamalai", "Vishvamadu",
        "Kilinochchi Town", "Uruthirapuram", "Karachchi", "Pachchilaipalli"
    ],
    "Kurunegala": [
        "Kurunegala", "Kuliyapitiya", "Narammala", "Wariyapola", "Pannala", "Melsiripura", "Giriulla", "Polgahawela",
        "Alawwa", "Bingiriya", "Bamunakotuwa", "Ganewatta", "Hettipola", "Ibbagamuwa", "Kobeigane",
        "Maho", "Nikaweratiya", "Panduwasnuwara", "Polpithigama", "Rideegama", "Udubaddawa", "Weerambugedara",
        "Maspotha", "Ambanpola", "Bowatenna", "Ehetuwewa", "Galagedera"
    ],
    "Mannar": [
        "Mannar", "Murunkan", "Madhu", "Nanattan", "Pesalai",
        "Mannar Island", "Talaimannar", "Erukkalampiddy", "Adampan", "Vidattaltivu",
        "Nanaddan", "Silavathurai", "Manthai West", "Musali", "Mannar Town"
    ],
    "Matale": [
        "Matale", "Dambulla", "Sigiriya", "Galewela", "Ukuwela", "Rattota", "Pallepola", "Nalanda",
        "Laggala", "Wilgamuwa", "Yatawatta", "Ambanganga Korale", "Laggala-Pallegama", "Matale Four Gravets",
        "Kekirawa", "Habarana", "Matale Town", "Aluvihare", "Palapathwela", "Knuckles Range",
        "Riverston", "Illukkumbura", "Elkaduwa"
    ],
    "Matara": [
        "Matara", "Weligama", "Mirissa", "Dikwella", "Hakmana", "Akuressa", "Devinuwara", "Kotapola",
        "Kamburugamuwa", "Thihagoda", "Malimbada", "Pitabeddara", "Kirinda", "Matara Four Gravets",
        "Gandara", "Pasgoda", "Kekanadura", "Matara Town", "Dondra", "Polhena", "Nilwala",
        "Madiha", "Kokawala", "Kirinda Puhulwella"
    ],
    "Monaragala": [
        "Monaragala", "Wellawaya", "Kataragama", "Buttala", "Medagama", "Thanamalwila", "Bibila", "Badalkumbura",
        "Siyambalanduwa", "Sevanagala", "Madulla", "Moneragala Town", "Bibile", "Okkampitiya", "Hurigaswewa",
        "Dehiattakandiya", "Galabedda", "Kandaketiya", "Koombiyakanda", "Rotawewa", "Yakkalamulla"
    ],
    "Mullaitivu": [
        "Mullaitivu", "Oddusuddan", "Puthukudiyiruppu", "Manthai East", "Weli Oya",
        "Thunukkai", "Puthukkudiyiruppu", "Mullaitivu Town", "Kokkilai", "Nayaru",
        "Kokkuthoduvai", "Ampalavanpokkanai", "Oddusudan", "Maritimepattu", "Pudukudiyiruppu"
    ],
    "Nuwara Eliya": [
        "Nuwara Eliya", "Hatton", "Maskeliya", "Talawakele", "Ginigathhena", "Walapane", "Kotagala", "Dayagama",
        "Bogawantalawa", "Lindula", "Agarapathana", "Hanguranketha", "Kotmale", "Ramboda", "Nanu Oya",
        "Pussellawa", "Norton Bridge", "Watawala", "Dickoya", "Nawalapitiya", "Ragala", "Haggala",
        "Labukele", "Pedro", "Kandapola", "Radella", "Rikillagaskada"
    ],
    "Polonnaruwa": [
        "Polonnaruwa", "Kaduruwela", "Medirigiriya", "Hingurakgoda", "Dimbulagala", "Lankapura", "Welikanda",
        "Elahera", "Thamankaduwa", "Polonnaruwa New Town", "Polonnaruwa Ancient City", "Aralaganwila",
        "Bakamuna", "Manampitiya", "Somawathiya", "Bendiyawewa", "Jayanthipura", "Giritale",
        "Minneriya", "Habarana", "Sigiriya", "Kalyanapura"
    ],
    "Puttalam": [
        "Puttalam", "Chilaw", "Nattandiya", "Wennappuwa", "Dankotuwa", "Marawila", "Anamaduwa", "Kalpitiya",
        "Mundel", "Noraicholai", "Palavi", "Puttalam Lagoon", "Madampe", "Udappuwa", "Bangadeniya",
        "Bolawatta", "Madhu Road", "Karuwalagaswewa", "Nawagattegama", "Mahawewa", "Eluvankulama",
        "Wilpattu", "Kala Wewa", "Puttalam Town"
    ],
    "Ratnapura": [
        "Ratnapura", "Embilipitiya", "Balangoda", "Pelmadulla", "Eheliyagoda", "Kuruwita", "Godakawela", "Kalawana",
        "Rakwana", "Nivitigala", "Kahawatta", "Weligepola", "Ayagama", "Imbulpe", "Kolonna", "Opanayaka",
        "Palmadulla", "Ratnapura Town", "Kiriella", "Elapatha", "Palindanuwara", "Malimboda"
    ],
    "Trincomalee": [
        "Trincomalee", "Kinniya", "Mutur", "Kantale", "China Bay", "Nilaveli", "Kuchchaveli",
        "Gomarankadawala", "Morawewa", "Seruwila", "Padavi Siripura", "Thambalagamuwa", "Somawathiya",
        "Trincomalee Town", "Fort Frederick", "Uppuveli", "Pigeon Island", "Marble Beach",
        "Verugal", "Pulmoddai", "Kalkudah", "Muttur"
    ],
    "Vavuniya": [
        "Vavuniya", "Cheddikulam", "Settikulam", "Nedunkeni", "Omanthai",
        "Vavuniya South", "Vavuniya North", "Venkalacheddikulam", "Puliyankulama", "Kebitigollewa",
        "Horowupotana", "Medawachchiya", "Vavuniya Town", "Thandikulam", "Nellikulama"
    ]
};

const ProfileSection = ({ title, children, onEdit, isEditing, showInfo = false, onShowInfo }) => (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                {showInfo && (
                    <button
                        onClick={onShowInfo}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        title="Show information"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>
            {!isEditing && (
                <button 
                    onClick={onEdit} 
                    className="text-blue-500 hover:text-blue-700 font-semibold transition-colors duration-200"
                >
                    Edit
                </button>
            )}
        </div>
        {children}
    </div>
);

const InfoModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Legal Document Requirements</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="space-y-4 text-gray-600">
                    <p className="font-medium text-gray-800">
                        Please submit the relevant documents based on your business type:
                    </p>
                    
                    <div className="space-y-3">
                        <div className="border-l-4 border-green-500 pl-4">
                            <h4 className="font-semibold text-gray-700">If you are a Farm Owner:</h4>
                            <p>You can submit business registration, tax registration certificate, agricultural certificates you have.</p>
                        </div>
                        
                        <div className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-semibold text-gray-700">If you are Delivery Personnel:</h4>
                            <p>Submit driving license, vehicle registration certificate, insurance documents.</p>
                        </div>
                        
                        <div className="border-l-4 border-purple-500 pl-4">
                            <h4 className="font-semibold text-gray-700">If you are a Service Provider:</h4>
                            <p>Submit NVQ certificate, professional qualifications, trade certificates, service permits.</p>
                        </div>
                        
                        <div className="border-l-4 border-orange-500 pl-4">
                            <h4 className="font-semibold text-gray-700">If you are an Industrial Supplier:</h4>
                            <p>Submit business registration, tax registration, import/export licenses, quality certificates.</p>
                        </div>
                        
                        <div className="border-l-4 border-red-500 pl-4">
                            <h4 className="font-semibold text-gray-700">If you are a Shop Owner:</h4>
                            <p>Submit business registration, trade license, tax registration, municipal permits.</p>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm">
                            <strong>Note:</strong> All documents should be in PDF, JPG, or PNG format with a maximum size of 5MB each.
                            You can upload up to 6 different legal documents.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserProfile = () => {
    const [profile, setProfile] = useState({});
    const [initialProfile, setInitialProfile] = useState({});
    const [editingSection, setEditingSection] = useState(null);
    const [errors, setErrors] = useState({});
    const [logoFile, setLogoFile] = useState(null);
    const [doc1File, setDoc1File] = useState(null);
    const [doc2File, setDoc2File] = useState(null);
    const [doc3File, setDoc3File] = useState(null);
    const [doc4File, setDoc4File] = useState(null);
    const [doc5File, setDoc5File] = useState(null);
    const [doc6File, setDoc6File] = useState(null);
    const [availableTowns, setAvailableTowns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/profile', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                setProfile(response.data);
                setInitialProfile(response.data);
                
                // Set available towns if district is already selected
                if (response.data.addressDistrict) {
                    setAvailableTowns(districtToTowns[response.data.addressDistrict] || []);
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Handle district change to update available towns
        if (name === 'addressDistrict') {
            const towns = districtToTowns[value] || [];
            setAvailableTowns(towns);
            
            // Clear the town selection if the district changes
            setProfile({ 
                ...profile, 
                [name]: value,
                addressTown: '' // Reset town when district changes
            });
        } 
        // Handle bank account number validation - only allow numbers
        else if (name === 'bankAccountNumber') {
            // Remove any non-numeric characters
            const numericValue = value.replace(/\D/g, '');
            setProfile({ ...profile, [name]: numericValue });
        } 
        else {
            setProfile({ ...profile, [name]: value });
        }
        
        // Clear the error for the field being edited
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };
    
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length === 0) return;
        
        const file = files[0];
        
        // Basic file validation
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setErrors({ ...errors, [name]: 'File size should not exceed 5MB' });
            return;
        }

        switch(name) {
            case 'logo': 
                setLogoFile(file); 
                break;
            case 'legalDoc1': 
                setDoc1File(file); 
                break;
            case 'legalDoc2': 
                setDoc2File(file); 
                break;
            case 'legalDoc3': 
                setDoc3File(file); 
                break;
            case 'legalDoc4': 
                setDoc4File(file); 
                break;
            case 'legalDoc5': 
                setDoc5File(file); 
                break;
            case 'legalDoc6': 
                setDoc6File(file); 
                break;
            default: 
                break;
        }

        // Clear any existing file errors
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    // Comprehensive validation function
    const validate = () => {
        const newErrors = {};
        
        if (editingSection === 'basic') {
            if (!profile.businessName?.trim()) {
                newErrors.businessName = 'Business name is required.';
            }
            if (!profile.businessType?.trim()) {
                newErrors.businessType = 'Business type is required.';
            }
        }
        
        if (editingSection === 'address') {
            if (!profile.addressPlace?.trim()) {
                newErrors.addressPlace = 'Place/Building is required.';
            }
            if (!profile.addressStreet?.trim()) {
                newErrors.addressStreet = 'Street is required.';
            }
            if (!profile.addressDistrict) {
                newErrors.addressDistrict = 'Please select a district.';
            }
            if (!profile.addressTown?.trim()) {
                newErrors.addressTown = 'Please select a town.';
            }
        }
        
        if (editingSection === 'bank') {
            if (!profile.bankName?.trim()) {
                newErrors.bankName = 'Bank name is required.';
            }
            if (!profile.bankAccountNumber?.trim()) {
                newErrors.bankAccountNumber = 'Account number is required.';
            } else if (!/^\d+$/.test(profile.bankAccountNumber)) {
                newErrors.bankAccountNumber = 'Account number must contain only numbers.';
            }
            if (!profile.bankBranch?.trim()) {
                newErrors.bankBranch = 'Branch is required.';
            }
            if (!profile.accountHolderName?.trim()) {
                newErrors.accountHolderName = 'Account holder name is required.';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) {
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('profileData', new Blob([JSON.stringify(profile)], { type: 'application/json' }));
        
        if (logoFile) formData.append('logo', logoFile);
        if (doc1File) formData.append('legalDoc1', doc1File);
        if (doc2File) formData.append('legalDoc2', doc2File);
        if (doc3File) formData.append('legalDoc3', doc3File);
        if (doc4File) formData.append('legalDoc4', doc4File);
        if (doc5File) formData.append('legalDoc5', doc5File);
        if (doc6File) formData.append('legalDoc6', doc6File);

        try {
            const response = await axios.put('/api/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setProfile(response.data);
            setInitialProfile(response.data);
            setEditingSection(null);
            setErrors({});
            
            // Clear file states
            setLogoFile(null); 
            setDoc1File(null); 
            setDoc2File(null); 
            setDoc3File(null);
            setDoc4File(null); 
            setDoc5File(null); 
            setDoc6File(null);
            
            // Success notification could be added here
            console.log('Profile updated successfully');
        } catch (error) {
            console.error("Failed to update profile:", error);
            setErrors({ general: 'Failed to save changes. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setProfile(initialProfile);
        setEditingSection(null);
        setErrors({});
        
        // Reset file states
        setLogoFile(null); 
        setDoc1File(null); 
        setDoc2File(null); 
        setDoc3File(null);
        setDoc4File(null); 
        setDoc5File(null); 
        setDoc6File(null);
        
        // Reset available towns based on initial profile
        if (initialProfile.addressDistrict) {
            setAvailableTowns(districtToTowns[initialProfile.addressDistrict] || []);
        } else {
            setAvailableTowns([]);
        }
    };

    const isEditing = (section) => editingSection === section;

    const renderFilePreview = (fileUrl, newFile, altText, className = "w-24 h-24") => {
        if (newFile) {
            return (
                <img 
                    src={URL.createObjectURL(newFile)} 
                    alt={`New ${altText} Preview`} 
                    className={`${className} object-cover rounded-md my-2 border`}
                />
            );
        }
        if (fileUrl) {
            return (
                <img 
                    src={fileUrl} 
                    alt={altText} 
                    className={`${className} object-cover rounded-md my-2 border`}
                />
            );
        }
        return null;
    };

    if (loading && !profile.businessName) {
        return (
            <div className="bg-gray-100 min-h-screen p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">My Business Profile</h1>
            
            {/* Information Modal */}
            <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
            
            {/* General Error Display */}
            {errors.general && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {errors.general}
                </div>
            )}
            
            {/* Basic Information Section */}
            <ProfileSection 
                title="Basic Information" 
                onEdit={() => setEditingSection('basic')} 
                isEditing={isEditing('basic')}
            >
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-grow space-y-4">
                        {/* Business Name */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Business Name *</label>
                            {isEditing('basic') ? (
                                <>
                                    <input 
                                        type="text" 
                                        name="businessName" 
                                        value={profile.businessName || ''} 
                                        onChange={handleInputChange} 
                                        className={`w-full p-3 border rounded-md transition-colors ${errors.businessName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                        placeholder="Enter your business name"
                                    />
                                    {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                                </>
                            ) : (
                                <p className="text-gray-800 text-lg">{profile.businessName || 'Not set'}</p>
                            )}
                        </div>

                        {/* Business Type */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Business Type *</label>
                            {isEditing('basic') ? (
                                <>
                                    <select 
                                        name="businessType" 
                                        value={profile.businessType || ''} 
                                        onChange={handleInputChange}
                                        className={`w-full p-3 border rounded-md bg-white transition-colors ${errors.businessType ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                    >
                                        <option value="">Select Business Type</option>
                                        <option value="Sole Proprietorship">Sole Proprietorship</option>
                                        <option value="Partnership">Partnership</option>
                                        <option value="Private Limited Company">Private Limited Company</option>
                                        <option value="Public Limited Company">Public Limited Company</option>
                                        <option value="Non-Profit Organization">Non-Profit Organization</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
                                </>
                            ) : (
                                <p className="text-gray-800">{profile.businessType || 'Not set'}</p>
                            )}
                        </div>
                    </div>

                    {/* Logo Section */}
                    <div className="flex-shrink-0 text-center">
                        <label className="block text-gray-700 font-semibold mb-2">Business Logo</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                            {renderFilePreview(profile.logoUrl, logoFile, "Business Logo", "w-32 h-32 mx-auto")}
                            {!profile.logoUrl && !logoFile && (
                                <div className="w-32 h-32 mx-auto bg-gray-200 rounded-md flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">No Logo</span>
                                </div>
                            )}
                            {isEditing('basic') && (
                                <input 
                                    type="file" 
                                    name="logo" 
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="mt-2 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </ProfileSection>

            {/* Business Address Section */}
            <ProfileSection 
                title="Business Address" 
                onEdit={() => setEditingSection('address')} 
                isEditing={isEditing('address')}
            >
                {isEditing('address') ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Place (House No, Building) *</label>
                            <input 
                                type="text" 
                                name="addressPlace" 
                                value={profile.addressPlace || ''} 
                                onChange={handleInputChange} 
                                className={`w-full p-3 border rounded-md transition-colors ${errors.addressPlace ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                placeholder="House number, building name"
                            />
                            {errors.addressPlace && <p className="text-red-500 text-sm mt-1">{errors.addressPlace}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Street *</label>
                            <input 
                                type="text" 
                                name="addressStreet" 
                                value={profile.addressStreet || ''} 
                                onChange={handleInputChange} 
                                className={`w-full p-3 border rounded-md transition-colors ${errors.addressStreet ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                placeholder="Street name"
                            />
                            {errors.addressStreet && <p className="text-red-500 text-sm mt-1">{errors.addressStreet}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">District *</label>
                            <select 
                                name="addressDistrict" 
                                value={profile.addressDistrict || ''} 
                                onChange={handleInputChange} 
                                className={`w-full p-3 border rounded-md bg-white transition-colors ${errors.addressDistrict ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                            >
                                <option value="">Select a District</option>
                                {sriLankanDistricts.map(district => (
                                    <option key={district} value={district}>{district}</option>
                                ))}
                            </select>
                            {errors.addressDistrict && <p className="text-red-500 text-sm mt-1">{errors.addressDistrict}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Town *</label>
                            <select 
                                name="addressTown" 
                                value={profile.addressTown || ''} 
                                onChange={handleInputChange} 
                                disabled={!profile.addressDistrict}
                                className={`w-full p-3 border rounded-md bg-white transition-colors ${errors.addressTown ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-1 focus:ring-blue-500 ${!profile.addressDistrict ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            >
                                <option value="">
                                    {!profile.addressDistrict ? 'First select a district' : 'Select a town'}
                                </option>
                                {availableTowns.map(town => (
                                    <option key={town} value={town}>{town}</option>
                                ))}
                            </select>
                            {errors.addressTown && <p className="text-red-500 text-sm mt-1">{errors.addressTown}</p>}
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 p-4 rounded-md">
                        <div className="text-gray-800">
                            <p className="mb-1">
                                <span className="font-medium">Address:</span> {profile.addressPlace || 'Not set'}, {profile.addressStreet || ''}
                            </p>
                            <p>
                                <span className="font-medium">Location:</span> {profile.addressTown || 'Not set'}, {profile.addressDistrict || 'Not set'}
                            </p>
                        </div>
                    </div>
                )}
            </ProfileSection>

            {/* Legal Documents Section with Info Button */}
            <ProfileSection 
                title="Legal Documents" 
                onEdit={() => setEditingSection('legal')} 
                isEditing={isEditing('legal')}
                showInfo={true}
                onShowInfo={() => setShowInfoModal(true)}
            >
                {isEditing('legal') ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Document 1 */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                            <label className="block text-gray-700 font-semibold mb-2">Legal Document 1</label>
                            {profile.legalDoc1Url && !doc1File && (
                                <div className="mb-2">
                                    <a href={profile.legalDoc1Url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                                        📄 View Current Document
                                    </a>
                                </div>
                            )}
                            {doc1File && (
                                <div className="mb-2">
                                    <p className="text-green-600 text-sm">📄 New file selected: {doc1File.name}</p>
                                </div>
                            )}
                            <input 
                                type="file" 
                                name="legalDoc1" 
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full"
                            />
                            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                        </div>

                        {/* Document 2 */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                            <label className="block text-gray-700 font-semibold mb-2">Legal Document 2</label>
                            {profile.legalDoc2Url && !doc2File && (
                                <div className="mb-2">
                                    <a href={profile.legalDoc2Url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                                        📄 View Current Document
                                    </a>
                                </div>
                            )}
                            {doc2File && (
                                <div className="mb-2">
                                    <p className="text-green-600 text-sm">📄 New file selected: {doc2File.name}</p>
                                </div>
                            )}
                            <input 
                                type="file" 
                                name="legalDoc2" 
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full"
                            />
                            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                        </div>

                        {/* Document 3 */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                            <label className="block text-gray-700 font-semibold mb-2">Legal Document 3</label>
                            {profile.legalDoc3Url && !doc3File && (
                                <div className="mb-2">
                                    <a href={profile.legalDoc3Url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                                        📄 View Current Document
                                    </a>
                                </div>
                            )}
                            {doc3File && (
                                <div className="mb-2">
                                    <p className="text-green-600 text-sm">📄 New file selected: {doc3File.name}</p>
                                </div>
                            )}
                            <input 
                                type="file" 
                                name="legalDoc3" 
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full"
                            />
                            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                        </div>

                        {/* Document 4 */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                            <label className="block text-gray-700 font-semibold mb-2">Legal Document 4</label>
                            {profile.legalDoc4Url && !doc4File && (
                                <div className="mb-2">
                                    <a href={profile.legalDoc4Url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                                        📄 View Current Document
                                    </a>
                                </div>
                            )}
                            {doc4File && (
                                <div className="mb-2">
                                    <p className="text-green-600 text-sm">📄 New file selected: {doc4File.name}</p>
                                </div>
                            )}
                            <input 
                                type="file" 
                                name="legalDoc4" 
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full"
                            />
                            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                        </div>

                        {/* Document 5 */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                            <label className="block text-gray-700 font-semibold mb-2">Legal Document 5</label>
                            {profile.legalDoc5Url && !doc5File && (
                                <div className="mb-2">
                                    <a href={profile.legalDoc5Url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                                        📄 View Current Document
                                    </a>
                                </div>
                            )}
                            {doc5File && (
                                <div className="mb-2">
                                    <p className="text-green-600 text-sm">📄 New file selected: {doc5File.name}</p>
                                </div>
                            )}
                            <input 
                                type="file" 
                                name="legalDoc5" 
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full"
                            />
                            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                        </div>

                        {/* Document 6 */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                            <label className="block text-gray-700 font-semibold mb-2">Legal Document 6</label>
                            {profile.legalDoc6Url && !doc6File && (
                                <div className="mb-2">
                                    <a href={profile.legalDoc6Url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                                        📄 View Current Document
                                    </a>
                                </div>
                            )}
                            {doc6File && (
                                <div className="mb-2">
                                    <p className="text-green-600 text-sm">📄 New file selected: {doc6File.name}</p>
                                </div>
                            )}
                            <input 
                                type="file" 
                                name="legalDoc6" 
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full"
                            />
                            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-700 mb-4">Uploaded Documents:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-white p-3 rounded border">
                                <p className="font-medium text-gray-600 text-sm mb-1">Legal Document 1</p>
                                {profile.legalDoc1Url ? (
                                    <a href={profile.legalDoc1Url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                                        📄 View Document
                                    </a>
                                ) : (
                                    <span className="text-gray-400 text-sm">No document uploaded</span>
                                )}
                            </div>
                            <div className="bg-white p-3 rounded border">
                                <p className="font-medium text-gray-600 text-sm mb-1">Legal Document 2</p>
                                {profile.legalDoc2Url ? (
                                    <a href={profile.legalDoc2Url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                                        📄 View Document
                                    </a>
                                ) : (
                                    <span className="text-gray-400 text-sm">No document uploaded</span>
                                )}
                            </div>
                            <div className="bg-white p-3 rounded border">
                                <p className="font-medium text-gray-600 text-sm mb-1">Legal Document 3</p>
                                {profile.legalDoc3Url ? (
                                    <a href={profile.legalDoc3Url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                                        📄 View Document
                                    </a>
                                ) : (
                                    <span className="text-gray-400 text-sm">No document uploaded</span>
                                )}
                            </div>
                            <div className="bg-white p-3 rounded border">
                                <p className="font-medium text-gray-600 text-sm mb-1">Legal Document 4</p>
                                {profile.legalDoc4Url ? (
                                    <a href={profile.legalDoc4Url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                                        📄 View Document
                                    </a>
                                ) : (
                                    <span className="text-gray-400 text-sm">No document uploaded</span>
                                )}
                            </div>
                            <div className="bg-white p-3 rounded border">
                                <p className="font-medium text-gray-600 text-sm mb-1">Legal Document 5</p>
                                {profile.legalDoc5Url ? (
                                    <a href={profile.legalDoc5Url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                                        📄 View Document
                                    </a>
                                ) : (
                                    <span className="text-gray-400 text-sm">No document uploaded</span>
                                )}
                            </div>
                            <div className="bg-white p-3 rounded border">
                                <p className="font-medium text-gray-600 text-sm mb-1">Legal Document 6</p>
                                {profile.legalDoc6Url ? (
                                    <a href={profile.legalDoc6Url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                                        📄 View Document
                                    </a>
                                ) : (
                                    <span className="text-gray-400 text-sm">No document uploaded</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </ProfileSection>

            {/* Bank Details Section */}
            <ProfileSection 
                title="Bank Account Details" 
                onEdit={() => setEditingSection('bank')} 
                isEditing={isEditing('bank')}
            >
                {isEditing('bank') ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Bank Name *</label>
                            <select 
                                name="bankName" 
                                value={profile.bankName || ''} 
                                onChange={handleInputChange}
                                className={`w-full p-3 border rounded-md bg-white transition-colors ${errors.bankName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                            >
                                <option value="">Select Bank</option>
                                <option value="Bank of Ceylon">Bank of Ceylon</option>
                                <option value="People's Bank">People's Bank</option>
                                <option value="Commercial Bank">Commercial Bank</option>
                                <option value="Hatton National Bank">Hatton National Bank</option>
                                <option value="Sampath Bank">Sampath Bank</option>
                                <option value="Nations Trust Bank">Nations Trust Bank</option>
                                <option value="DFCC Bank">DFCC Bank</option>
                                <option value="Union Bank">Union Bank</option>
                                <option value="Pan Asia Banking Corporation">Pan Asia Banking Corporation</option>
                                <option value="Seylan Bank">Seylan Bank</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Branch *</label>
                            <input 
                                type="text" 
                                name="bankBranch" 
                                value={profile.bankBranch || ''} 
                                onChange={handleInputChange}
                                className={`w-full p-3 border rounded-md transition-colors ${errors.bankBranch ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                placeholder="Branch name"
                            />
                            {errors.bankBranch && <p className="text-red-500 text-sm mt-1">{errors.bankBranch}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Account Number *</label>
                            <input 
                                type="text" 
                                name="bankAccountNumber" 
                                value={profile.bankAccountNumber || ''} 
                                onChange={handleInputChange}
                                className={`w-full p-3 border rounded-md transition-colors ${errors.bankAccountNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                placeholder="Account number (numbers only)"
                            />
                            {errors.bankAccountNumber && <p className="text-red-500 text-sm mt-1">{errors.bankAccountNumber}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Account Holder Name *</label>
                            <input 
                                type="text" 
                                name="accountHolderName" 
                                value={profile.accountHolderName || ''} 
                                onChange={handleInputChange}
                                className={`w-full p-3 border rounded-md transition-colors ${errors.accountHolderName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                placeholder="Account holder name"
                            />
                            {errors.accountHolderName && <p className="text-red-500 text-sm mt-1">{errors.accountHolderName}</p>}
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 p-4 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600 mb-2"><span className="font-medium">Bank:</span> {profile.bankName || 'Not set'}</p>
                                <p className="text-gray-600"><span className="font-medium">Branch:</span> {profile.bankBranch || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 mb-2"><span className="font-medium">Account Number:</span> {profile.bankAccountNumber ? `****${profile.bankAccountNumber.slice(-4)}` : 'Not set'}</p>
                                <p className="text-gray-600"><span className="font-medium">Account Holder:</span> {profile.accountHolderName || 'Not set'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </ProfileSection>

            {/* Action Buttons */}
            {editingSection && (
                <div className="flex justify-end space-x-4 mt-8">
                    <button 
                        onClick={handleCancel} 
                        disabled={loading}
                        className="bg-gray-500 text-white font-bold py-3 px-6 rounded-md hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={loading}
                        className="bg-green-500 text-white font-bold py-3 px-6 rounded-md hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
