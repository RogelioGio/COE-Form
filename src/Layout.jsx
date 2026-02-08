import COE_Form from "./COE_Form"
import Completed from "./Completed"
import { useState } from "react";

export default function Layout() {
    const [submitted, setSubmitted] = useState(false)

    return (
        <div className="w-full min-h-screen h-full bg-[url('https://d2zbzumnfle0rf.cloudfront.net/assets/uploads/63c34a7c6bd2f-LRA-office.png')] bg-cover bg-center">
            <div className="w-full min-h-screen h-full bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-10">
                {
                    submitted ? <Completed /> : <COE_Form setSubmitted={setSubmitted} submitted={submitted}/>
                }
            </div>
        </div>
    )
};