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
import COE_Form from './COE_Form'
import Completed from './Completed'
 
function App() {
  const [submitted, setSubmitted] = useState(false)

  return <>
    {
      submitted ? <Completed /> : <COE_Form setSubmitted={setSubmitted} submitted={submitted}/>
    }
  </>
}

export default App
