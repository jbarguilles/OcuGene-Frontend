'use client';

import {React, useState, useEffect} from 'react'
import Navbar from '@/components/navbarLanding'
import { useRouter } from 'next/navigation';
import './patient-list.css'

function page() {

    const [patientsData, setPatientsData] = useState([]);
    const router = useRouter();
    const [storedRole, setStoredRole] = useState('');

    useEffect(()=> {
        // Retrieve user information from localStorage
        setStoredRole(localStorage.getItem('role'))
        console.log(localStorage.getItem('role'))
    
        if (!localStorage.getItem('role') || (JSON.parse(localStorage.getItem('role')) !== 'admin' && JSON.parse(localStorage.getItem('role')) !== 'clinician')) {
        router.push('/login');
        }

        const fetchPatientsData = async () => {
    
          try {
            const response = await fetch("http://localhost:8080/patient/get-all");
            const responseData = await response.json();
            setPatientsData(responseData);
          } catch (error) {
            console.log("Error fetching patient data: ", error);
          }
          
        };
    
        fetchPatientsData();
    }, []);

    const handleViewPatientRecord = (patientCode) => {
        localStorage.setItem('view_patientCode', patientCode);
        router.push("/registry/view-record");
    }
    // Determine if the stored role is 'admin' or 'clinician'
     const isAdminOrClinician = storedRole && (JSON.parse(storedRole) === 'admin' || JSON.parse(storedRole) === 'clinician');
    return (
        <>
        {isAdminOrClinician &&
         <div>
         <Navbar></Navbar>
         <div className='title'> Patient List </div>
         <div className='p-table'>
             <table >
             <thead>
                 <tr>
                 <th>Patient Code</th>
                 <th>First Name</th>
                 <th>Last Name</th>
                 <th>Disease</th>
                 <th>Variant</th>
                 <th>Action</th>
                 </tr>
             </thead>
             <tbody>
                 {
                 patientsData.map((patient, index) => {
                     return (
                     <tr key={index}>
                         <td>{patient.patientCode}</td>
                         <td>{patient.firstName}</td>
                         <td>{patient.lastName}</td>
                         <td>{patient.diagnosis}</td>
                         <td>{patient.variant}</td>
                         <td>
                         <button onClick={()=>handleViewPatientRecord(patient.patientCode)}>
                             View Patient Data
                         </button>
                         </td>
                     </tr>
                     )
                 })
                 }
             </tbody>
             </table>
         </div>
         </div>}
        </>
       
    )
}

export default page