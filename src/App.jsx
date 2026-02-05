import { use, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useFormik } from 'formik'


function App() {
  const [count, setCount] = useState(0)
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
    validationSchema: null,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });


  return (
    <>
      <div className='bg-white w-xl h-xl rounded-xl p-5 space-y-10'>
        <div className='text-black'>
          <p className='font-text'>Request for</p>
          <h1 className='text-4xl'>Certificate of Employment</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className='space-y-2'>
            <div>
              <label className='font-text block text-sm font-medium text-gray-700 text-left mb-2' htmlFor="Requestor_Name">Requestor Name</label>
              <input
                className='border text-black border-gray-300 rounded-md p-2 w-full '
                id="Requestor_Name"
                name="Requestor_Name"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.Requestor_Name}
              />
            </div>
            <div>
              <label className='font-text block text-sm font-medium text-gray-700 text-left mb-2' htmlFor="Data_Owner">Data Owner</label>
              <input
                className='border text-black border-gray-300 rounded-md p-2 w-full '
                id="Data_Owner"
                name="Data_Owner"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.Data_Owner}
              />
            </div>
            <div>
              <label className='font-text block text-sm font-medium text-gray-700 text-left mb-2' htmlFor="Requester_Email">Requester Email</label>
              <input
                className='border text-black border-gray-300 rounded-md p-2 w-full '
                id="Requester_Email"
                name="Requester_Email"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.Requester_Email}
              />
            </div>
            <div>
              <label className='font-text block text-sm font-medium text-gray-700 text-left mb-2' htmlFor="Relation">Relation</label>
              <input
                className='border text-black border-gray-300 rounded-md p-2 w-full '
                id="Relation"
                name="Relation"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.Relation}
              />
            </div>
            <div className='flex flex-row w-full justify-between'>
                <div>
                  <label className='font-text block text-sm font-medium text-gray-700 text-left mb-2' htmlFor="Issue_On">Issue On</label>
                  <input
                    className='border text-black border-gray-300 rounded-md p-2 w-full '
                    id="Issue_On"
                    name="Issue_On"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.Issue_On}
                  />
                </div>
                <div>
                  <label className='font-text block text-sm font-medium text-gray-700 text-left mb-2' htmlFor="Issue_at">Issue at</label>
                  <input
                    className='border text-black border-gray-300 rounded-md p-2 w-full '
                    id="Issue_at"
                    name="Issue_at"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.Issue_at}
                  />
                </div>
            </div>
            <div>
              <label className='font-text block text-sm font-medium text-gray-700 text-left mb-2' htmlFor="SPA_Authorization">SPA Authorization</label>
              <input
                className='border text-black border-gray-300 rounded-md p-2 w-full '
                id="SPA_Authorization"
                name="SPA_Authorization"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.SPA_Authorization}
              />
            </div>
            <div>
              <label className='font-text block text-sm font-medium text-gray-700 text-left mb-2' htmlFor="LRA_Official_ID">LRA Official ID</label>
              <input
                className='border text-black border-gray-300 rounded-md p-2 w-full '
                id="LRA_Official_ID"
                name="LRA_Official_ID"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.LRA_Official_ID}
              />
            </div>
            

            <button type='submit' className='w-full mt-5 bg-blue-600 text-white font-text px-4 py-2 rounded-md hover:bg-blue-700'>Submit</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default App
