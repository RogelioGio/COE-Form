import { use, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useFormik } from 'formik'
import * as Yup from 'yup';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Paperclip, FileIcon, X } from "lucide-react"
import { toast } from 'sonner'
import { set } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react';
 

export default function COE_Form({ submitted ,setSubmitted }) {
  const [submitting, setSubmitting] = useState(false);
  const allowedFileTypes = ["application/pdf", "image/jpeg", "image/png"];
  const allowedDomain = ["gmail.com", "yahoo.com", "outlook.com", "company.com"]; // Example allowed domains

  const SPARef = useRef(null);
  const [spa, setSPA] = useState({});
  const LRAIdRef = useRef(null);
  const [LRAId, setLRAId] = useState({});

  const formik = useFormik({
    initialValues: {
      Timestamp: '',
      Requestor_Name: '',
      Data_Owner: '',
      Requester_Email: '',
      Relation: '',
      ID_Number: '',
      Issue_On: '',
      Issue_at: '',
      SPA_Authorization: '',
      LRA_Official_ID: '',
    },
    validationSchema: Yup.object({
      Requestor_Name: Yup.string().required('Requestor Name is required').max(50, 'Requestor Name must be at most 50 characters').min(5, 'Requestor Name must be at least 5 characters') ,
      Data_Owner: Yup.string().required('Data Owner is required'),
      Requester_Email: Yup.string().email('Invalid email address').required('Requester Email is required').test(
      'is-company-domain',
      'only valid email domains are allowed',
      (value) => {
        if (!value) return false; // If the field is empty, it's invalid
        const domain = value.substring(value.lastIndexOf("@") + 1);
        return allowedDomain.includes(domain.toLowerCase());
      }
    ),
      Relation: Yup.string().when('Data_Owner', {
        is: 'No',
        then: (schema) => schema.required('Relation is required when Data Owner is No'),
        otherwise: (schema) => schema.optional(),
      }),
      Issue_On: Yup.string().required('Issue On is required'),
      Issue_at: Yup.string().required('Issue at is required'),
      LRA_Official_ID: Yup.string().required('LRA Official ID is required'),
      ID_Number: Yup.string().required('ID Number is required').max(50, 'ID Number must be at most 50 characters'),
    }),
   onSubmit: (values, {resetForm}) => {
  // 1. Create payload and CONVERT DATE TO STRING
  const submissionData = {
    ...values,
    // Convert the Date object to a readable string (e.g., "2/6/2026")
    Issue_On: values.Issue_On ? new Date(values.Issue_On).toLocaleDateString() : "",
    Timestamp: new Date().toLocaleString()
  };

  // console.log("Sending to Server:", submissionData);

  // 2. Call Google Apps Script
//   if (window.google && window.google.script) {
//     const request = window.google.script.run
//       .withSuccessHandler((response) => {
//         setSubmitting(false);
//         if (response && response.status === "success") {
//           resetForm();
//           setSPA({});   // Reset file UI
//           setLRAId({}); // Reset file UI
//           setSubmitted(true);
//         } else {
//           alert("Error: " + (response.message || "Unknown error"));
//         }
//       })
//       .withFailureHandler((error) => {
//         setSubmitting(false);
//         alert("System Error: " + error);
//       })
//     .saveForm(submissionData)
//     if(submitting){
//       return;
//     }else {
//       setSubmitting(true);
//       setSubmitted(true);
//     }

//     toast.promise(request, {
//       loading: "Submitting request...",
//       success: () => {
//         setSubmitting(false);
//         return "Request submitted successfully!";
//       },
//       error: (err) => {
//         setSubmitting(false);
//         return "Submission failed: " + err;
//       } // <--- This was the missing closing brace for the error function
//     });

//   } else {
//     // Fallback for local testing
//     if(submitting){
//       return;
//     }else {
//       setSubmitting(true);
//     }
//     toast.error("Google Script not found. Are you running in local mode?" );
//     setTimeout(() => {
//       setSubmitting(false);
//     }, 2000);
//   }

// For the purpose of this demo, we'll simulate a successful submission with a timeout
if(submitting){
      return;
    }else {
      setSubmitting(true);
    }
setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 2000);


},
  });

  // Handle Filecheck
  const handleFileClick = () => {
    SPARef.current?.click();
  }
  const handleDeleteFile = () => {
    setSPA({});
    formik.setFieldValue("SPA_Authorization", '');
  }
  const uploadLRAIdClick = () => {
    LRAIdRef.current?.click();
  }
  const handleLRAIdDelete = () => {
    setLRAId({});
    formik.setFieldValue("LRA_Official_ID", '');
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if(file.name === LRAIdRef.current?.files[0]?.name && LRAIdRef.current?.files[0] != null){
      toast.error("SPA Authorization cannot be the same file as LRA Official ID.");
      return;
    }

    if(!allowedFileTypes.includes(file.type)){
      toast.error("Invalid file type. Only PDF, JPG, and PNG are allowed.");
      return;
    }

    setSPA({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      formik.setFieldValue("SPA_Authorization", base64String);
    }
    reader.readAsDataURL(file);
  };
  const handleLRAIdChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    if(file.name === SPARef.current?.files[0]?.name && SPARef.current?.files[0] != null){
      toast.error("LRA Official ID cannot be the same file as SPA Authorization.");
      return;
    }


    if(!allowedFileTypes.includes(file.type)){
      toast.error("Invalid file type. Only PDF, JPG, and PNG are allowed.");
      return;
    }

    setLRAId({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      formik.setFieldValue("LRA_Official_ID", base64String);
    }
    reader.readAsDataURL(file);
  }


  return (
    <>
      <div className='bg-white w-xl h-xl rounded-xl p-6 space-y-5'>
        <div className='text-black'>
          <p className='font-text md:text-base text-xs'>Request for</p>
          <h1 className='md:text-4xl text-xl'>Certificate of Employment</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className='space-y-2'>
            <div>
              <div className='flex flex-row justify-between'>
                <label className='font-text block text-sm font-medium text-gray-700 text-left mb-2' htmlFor="Requestor_Name">Requestor Name</label>
                <p className='text-sm text-gray-500'>Required</p>
              </div>
              <input
                className='border text-black border-gray-300 rounded-md p-2 w-full '
                id="Requestor_Name"
                name="Requestor_Name"
                type="text"
                pattern="^[a-zA-Z\s,]+$"
                placeholder='Last Name, First Name, Middle Name '
                maxLength="50"
                minlength="5"
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  formik.setFieldValue("Requestor_Name", onlyLetters);
                }}
                value={formik.values.Requestor_Name}
              />
              {formik.touched.Requestor_Name && formik.errors.Requestor_Name ? (
                <p className="text-sm text-red-600">{formik.errors.Requestor_Name}</p>
              ) : null}
            </div>
            <div>
              <div className='flex justify-between'>
                <label className='font-text block text-sm font-medium text-gray-700 text-left mb-2' htmlFor="Data_Owner">Data Owner</label>
                <p className='text-sm text-gray-500'>Required</p>
              </div>
              <div className='flex flex-row text-black justify-between w-full gap-4'>
                <div className='flex flex-row w-full justify-around gap-4'>
                  <div className={`border border-gray-300 rounded-sm w-full md:p-4 p-2 cursor-pointer justify-between flex hover:bg-accent ${formik.values.Data_Owner === "Yes" ? 'bg-accent' : ''}`} onClick={()=>formik.setFieldValue('Data_Owner', 'Yes')}>
                    <label htmlFor="dataOwnerYes">Yes</label>
                    <input
                      type="radio"
                      id="dataOwnerYes"
                      name="Data_Owner"
                      value="Yes"
                      checked={formik.values.Data_Owner === "Yes"}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className={`border border-gray-300 rounded-sm w-full md:p-4 p-2 cursor-pointer justify-between flex hover:bg-accent ${formik.values.Data_Owner === "No" ? 'bg-accent' : ''}`} onClick={()=>formik.setFieldValue('Data_Owner', 'No')}>
                    <label htmlFor="dataOwnerNo">No</label>
                    <input
                      type="radio"
                      id="dataOwnerNo"
                      name="Data_Owner"
                      value="No"
                      checked={formik.values.Data_Owner === "No"}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
              </div>
              {formik.touched.Data_Owner && formik.errors.Data_Owner ? (
                <p className="text-sm text-red-600">{formik.errors.Data_Owner}</p>
              ) : null}
            </div>
            <div>
              <div className='flex justify-between'>
                <label className='font-text block text-sm font-medium text-gray-700 text-left mb-2' htmlFor="Requester_Email">Requester Email</label>
                <p className='text-sm text-gray-500'>Required</p>
              </div>
              <input
                className='border text-black border-gray-300 rounded-md p-2 w-full '
                id="Requester_Email"
                name="Requester_Email"
                type="text"
                placeholder='example@email.com'
                onChange={formik.handleChange}
                value={formik.values.Requester_Email}
              />
              {formik.touched.Requester_Email && formik.errors.Requester_Email ? (
                <p className="text-sm text-red-600">{formik.errors.Requester_Email}</p>
              ) : null}
            </div>
            {
              formik.values.Data_Owner === "No" && (<>
              <div>
                <div className='flex justify-between'>
                  <label className='font-text block text-sm font-medium text-gray-700 text-left mb-2' htmlFor="Relation">Relation with the requester</label>
                  <p className='text-sm text-gray-500'>Required</p>
                </div>
                {/* <input
                  className='border text-black border-gray-300 rounded-md p-2 w-full '
                  id="Relation"
                  name="Relation"
                  type="text"
                  disabled={formik.values.Data_Owner === "Yes" ? true : false}
                  placeholder='e.g. Friend, Colleague, Manager'
                  onChange={formik.handleChange}
                  value={formik.values.Relation}
                /> */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className='border border-gray-200 p-2 rounded-md w-full text-left hover:bg-gray-100 cursor-pointer flex justify-between items-center'>
                      <span className={`${formik.values.Relation ? "text-black" : "text-gray-500"}`}>{formik.values.Relation || "Select relation with the requester"}</span>
                       <ChevronDown className={`${formik.values.Relation ? "text-black" : "text-gray-500"}`}/>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup value={formik.values.Relation} onValueChange={(value) => formik.setFieldValue("Relation", value)}>
                      <DropdownMenuRadioItem value="Colleague">Colleague</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Manager">Manager</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Family">Family</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Other">Other</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

              </div>
              {formik.touched.Relation && formik.errors.Relation ? (
                  <p className="text-sm text-red-600">{formik.errors.Relation}</p>
                ) : null}
              </>  
          )
            }
            <div className='flex md:flex-row flex-col w-full justify-between gap-4'>
                <div className='w-full'>
                  <div className='flex flex-row w-full justify-between'>
                    <label className='font-text block text-sm font-medium text-gray-700 text-left mb-2' htmlFor="Issue_on">Issue On</label>
                    <p className='text-sm text-gray-500'>Required</p>
                  </div>
                  <div className='relative items-center justify-center gap-2'>
                    {/* <input
                      className='border text-black border-gray-300 rounded-md p-2 w-full '
                      id="Issue_On"
                      name="Issue_On"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.Issue_On}
                    /> */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className={`border flex flex-row items-center justify-between text-black border-gray-300 rounded-md p-2 w-full ${formik.values.Issue_On ? "text-black" : "text-gray-500"}`}>
                            {formik.values.Issue_On ? new Date(formik.values.Issue_On).toLocaleDateString() : "Select a date"}
                            <ChevronDown className={`${formik.values.Issue_On ? "text-black" : "text-gray-500"}`}/>
                          </div>
                      </PopoverTrigger>
                      <PopoverContent className={"p-0 w-fit"}>
                        <Calendar
                        mode="single"
                        selected={formik.values.Issue_On ? new Date(formik.values.Issue_On) : undefined}
                        onSelect={(date) => formik.setFieldValue("Issue_On", date)}
                        className="rounded-lg border"
                        captionLayout="dropdown"
                        disabled={(date) => date < new Date()}
                      />
                      </PopoverContent>
                    </Popover>
                    {formik.touched.Issue_On && formik.errors.Issue_On ? (
                    <p className="text-sm text-red-600">{formik.errors.Issue_On}</p>
                  ) : null}
                  </div>
                </div>
                <div className='w-full'>
                  <div className='flex flex-row w-full justify-between'>
                    <label className='font-text block text-sm font-medium text-gray-700 text-left mb-2' htmlFor="Issue_at">Issue at</label>
                    <p className='text-sm text-gray-500'>Required</p>
                  </div>
                  
                  <input
                    className='border text-black border-gray-300 rounded-md p-2 w-full '
                    id="Issue_at"
                    name="Issue_at"
                    placeholder='e.g. Company Name, City'
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.Issue_at}
                  />
                    {formik.touched.Issue_at && formik.errors.Issue_at ? (
                    <p className="text-sm text-red-600">{formik.errors.Issue_at}</p>
                  ) : null}
                </div>
            </div>
            <div className='flex sm:flex-col flex-col w-full gap-4'>
              {
                formik.values.Data_Owner === "No" ? (
                  <div className='w-full'>
                      <div className='flex flex-row w-full justify-between'>
                        <label className='font-text block text-sm font-medium text-gray-700 text-left mb-2' htmlFor="SPA_Authorization">SPA or Authorization</label>
                      </div>
                    <input type="file" ref={SPARef} className='hidden' onChange={handleFileChange} id='SPA_Authorization' accept=".pdf, .jpg, .jpeg, .png"/>
                    <div onClick={handleFileClick} className="relative p-10 gap-5 border-dashed border-2 cursor-pointer rounded-2xl flex flex-row justify-center items-center hover:bg-gray-100 transition-all ease-in-out border-gray-300">
                      <FileIcon size={50} />
                      {
                        spa.name ? (
                          <X className='absolute top-2 right-2 cursor-pointer' onClick={(e) => {e.stopPropagation(), handleDeleteFile()}}/>
                        ) : null  
                      }
                      {
                        spa.name ? (
                          <div className='text-center'>
                            <p className='font-text font-medium text-sm'>{spa.name}</p>
                            <p className='text-sm text-gray-500'>{(spa.size / 1024).toFixed(2)} KB</p>
                          </div>
                        ) : (
                          <p className='text-center text-gray-500 text-sm'>Click to upload SPA Authorization</p>
                        )
                      }
                    </div>
                    {formik.touched.Data_Owner && formik.errors.Data_Owner ? (
                    <p className="text-sm text-red-600">{formik.errors.Data_Owner}</p>
                  ) : null}
                  </div>
                ) : null
              }
              <div className='w-full'>
                    <div className='flex flex-row w-full justify-between'>
                      <label className='font-text block text-sm font-medium text-gray-700 text-left mb-2' htmlFor="LRA_Official_ID">LRA Official ID</label>
                      <p className='text-sm text-gray-500'>Required</p>
                  </div>
                  <input type="file" ref={LRAIdRef} className='hidden' onChange={handleLRAIdChange} id='LRA_Official_ID' accept=".pdf, .jpg, .jpeg, .png"/>
                  <div onClick={uploadLRAIdClick} className="relative gap-2 p-10 border-dashed border-2 cursor-pointer rounded-2xl flex flex-row justify-center items-center hover:bg-gray-100 transition-all ease-in-out border-gray-300">
                  <FileIcon size={50} />
                    {
                      LRAId.name ? (
                        <X className='absolute top-2 right-2 cursor-pointer' onClick={(e) => {e.stopPropagation(), handleLRAIdDelete()}}/>
                      ) : null  
                    }
                    {
                    LRAId.name ? (
                      <div className='text-center'>
                        <p className='font-text font-medium text-sm'>{LRAId.name}</p>
                        <p className='text-sm text-gray-500'>{(LRAId.size / 1024).toFixed(2)} KB</p>
                      </div>
                    ) : (
                      <p className='text-center text-gray-500 text-sm'>Click to upload LRA Official ID</p>
                    )
                  }
                </div>
                  {formik.touched.LRA_Official_ID && formik.errors.LRA_Official_ID ? (
                    <p className="text-sm text-red-600">{formik.errors.LRA_Official_ID}</p>
                  ) : null}
              </div>
            </div>
            <div>
              <div className='flex flex-row justify-between'>
                <label className='font-text block text-sm font-medium text-gray-700 text-left mb-2' htmlFor="ID_Number">ID Number</label>
                <p className='text-sm text-gray-500'>Required</p>
              </div>
              <input
                className='border text-black border-gray-300 rounded-md p-2 w-full '
                id="ID_Number"
                name="ID_Number"
                type="text"
                placeholder='00000000000'
                maxLength="50"
                onBlur={formik.handleBlur}
                value={formik.values.ID_Number}
                onChange={(e) => {
                  const value = e.target.value;
                  const onlyNums = value.replace(/[^0-9]/g, '');
                  formik.setFieldValue("ID_Number", onlyNums);
                }}
              />
              {formik.touched.ID_Number && formik.errors.ID_Number ? (
                <p className="text-sm text-red-600">{formik.errors.ID_Number}</p>
              ) : null}
            </div>
            <button type='submit' className={`w-full mt-5 bg-gray-800 text-white font-text rounded-md hover:bg-gray-700 p-5 transition-all ease-in-out cursor-pointer ${submitting ? "opacity-50 cursor-not-allowed" : ""}`} onClick={() => formik.setFieldValue("Timestamp", new Date().toLocaleString())} disabled={submitting}>
              {
                submitting ? "Submitting..." : "Submit Request"
              }
            </button>
          </form>
        </div>
      </div>
    </>
  )
}