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

function App() {
  const [count, setCount] = useState(0)
  const [submitting, setSubmitting] = useState(false);

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
      Requestor_Name: Yup.string().required('Requestor Name is required').max(50, 'Requestor Name must be at most 50 characters'),
      Data_Owner: Yup.string().required('Data Owner is required'),
      Requester_Email: Yup.string().email('Invalid email address').required('Requester Email is required'),
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
    onSubmit: values => {
      formik.setFieldValue("Timestamp", new Date().toLocaleString());
      console.log("Form values:", values);
      toast.success("Form submitted successfully!" );
      // google.script.run.withSuccessHandler((response) => {
      //   console.log("Data saved successfully:", response);
      //   alert("Form submitted successfully!");
      // }).withFailureHandler((error) => {
      //   console.error("Error saving data:", error);
      //   alert("Error submitting form. Please try again.");
      // }).sampleFunction(values);
    },
  });

  // Handle Filecheck
  const handleFileClick = () => {
    SPARef.current?.click();
  }
  const uploadLRAIdClick = () => {
    LRAIdRef.current?.click();
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

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
      <div className='w-screen h-screen bg-gray-800 flex items-center justify-center'>
        <div className='bg-white w-xl h-xl rounded-xl p-6 space-y-5'>
        <div className='text-black'>
          <p className='font-text'>Request for</p>
          <h1 className='text-4xl'>Certificate of Employment</h1>
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
                placeholder='Last Name, First Name, Middle Name '
                maxLength="50"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
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
                  <div className={`border border-gray-300 rounded-sm w-full p-4 cursor-pointer justify-between flex hover:bg-accent ${formik.values.Data_Owner === "Yes" ? 'bg-accent' : ''}`} onClick={()=>formik.setFieldValue('Data_Owner', 'Yes')}>
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
                  <div className={`border border-gray-300 rounded-sm w-full p-4 cursor-pointer justify-between flex hover:bg-accent ${formik.values.Data_Owner === "No" ? 'bg-accent' : ''}`} onClick={()=>formik.setFieldValue('Data_Owner', 'No')}>
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
                <input
                  className='border text-black border-gray-300 rounded-md p-2 w-full '
                  id="Relation"
                  name="Relation"
                  type="text"
                  disabled={formik.values.Data_Owner === "Yes" ? true : false}
                  placeholder='e.g. Friend, Colleague, Manager'
                  onChange={formik.handleChange}
                  value={formik.values.Relation}
                />
              </div>
              {formik.touched.Relation && formik.errors.Relation ? (
                  <p className="text-sm text-red-600">{formik.errors.Relation}</p>
                ) : null}
              </>  
          )
            }
            <div className='flex flex-row w-full justify-between gap-4'>
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
                        <div className={`border text-black border-gray-300 rounded-md p-2 w-full ${formik.values.Issue_On ? "text-black" : "text-gray-500"}`}>{formik.values.Issue_On ? new Date(formik.values.Issue_On).toLocaleDateString() : "Select a date"}</div>
                      </PopoverTrigger>
                      <PopoverContent className={"p-0 w-fit"}>
                        <Calendar
                        mode="single"
                        selected={formik.values.Issue_On ? new Date(formik.values.Issue_On) : undefined}
                        onSelect={(date) => formik.setFieldValue("Issue_On", date)}
                        className="rounded-lg border"
                        captionLayout="dropdown"
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
            <div className='flex flex-row w-full gap-4'>
              {
                formik.values.Data_Owner === "No" ? (
                  <div className='w-full'>
                      <div className='flex flex-row w-full justify-between'>
                        <label className='font-text block text-sm font-medium text-gray-700 text-left mb-2' htmlFor="SPA_Authorization">SPA or Authorization</label>
                      </div>
                    <input type="file" ref={SPARef} className='hidden' onChange={handleFileChange} id='SPA_Authorization'/>
                    <div onClick={handleFileClick} className="p-10 border-dashed border-2 cursor-pointer rounded-2xl flex flex-row justify-center items-center hover:bg-gray-100 transition-all ease-in-out border-gray-300">
                      <FileIcon className='mx-auto mb-2' />
                      {
                        spa.name ? (
                          <div className='text-center'>
                            <p className='font-text font-medium'>{spa.name}</p>
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
                  <input type="file" ref={LRAIdRef} className='hidden' onChange={handleLRAIdChange} id='LRA_Official_ID'/>
                  <div onClick={uploadLRAIdClick} className="gap-2 p-10 border-dashed border-2 cursor-pointer rounded-2xl flex flex-row justify-center items-center hover:bg-gray-100 transition-all ease-in-out border-gray-300">
                  <FileIcon className= {``} />
                  {
                    LRAId.name ? (
                      <div className='text-center'>
                        <p className='font-text font-medium'>{LRAId.name}</p>
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
                onChange={formik.handleChange}
                value={formik.values.ID_Number}
              />
              {formik.touched.ID_Number && formik.errors.ID_Number ? (
                <p className="text-sm text-red-600">{formik.errors.ID_Number}</p>
              ) : null}
            </div>
            <button type='submit' className='w-full mt-5 bg-gray-800 text-white font-text rounded-md hover:bg-gray-700 p-5 transition-all ease-in-out cursor-pointer' onClick={() => formik.setFieldValue("Timestamp", new Date().toLocaleString())}>Submit</button>
          </form>
        </div>
      </div>
      </div>
    </>
  )
}

export default App
