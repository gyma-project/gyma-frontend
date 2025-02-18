import { Dispatch, InputHTMLAttributes, SetStateAction } from "react";

interface TextboxProps{
    label: string;
    width?: string;
    otherTextboxProps?: any;
}

export default function Textbox({label, width, otherTextboxProps}: TextboxProps){
    return (
        <div>
            <p className="mb-2">{label}:</p>
            <textarea {...otherTextboxProps} className={`w-full ${width && `w-[${width}]`} border border-red-500 text-[12px] rounded-xl py-2 px-5 resize-none`}/>
        </div>
    )
}