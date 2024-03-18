import React from 'react'
import '../../index.css'

export default function Stepper(props) {
  return (
    <div>
    <ol className="flex items-center justify-center w-5/6 mx-auto space-x-4  sm:flex sm:space-x-12 sm:space-y-0 rtl:space-x-reverse">
        <li className={props.ifActive.step1?'stepper-li-active':'stepper-li'}>
            <span className={props.ifActive.step1?'stepper-span-active':'stepper-span'}>
                1
            </span>
            <span>
                <h3 className="font-semibold leading-tight">Services</h3>
            </span>
        </li>
        <li className={props.ifActive.step2?'stepper-li-active':'stepper-li'}>
            <span className={props.ifActive.step2?'stepper-span-active':'stepper-span'}>
                2
            </span>
            <span>
                <h3 className="font-semibold leading-tight">Time</h3>
            </span>
        </li>
        <li className={props.ifActive.step3?'stepper-li-active':'stepper-li'}>
            <span className={props.ifActive.step3?'stepper-span-active':'stepper-span'}>
                3
            </span>
            <span>
                <h3 className="font-semibold leading-tight">Info</h3>
            </span>
        </li>
        <li className={props.ifActive.step4?'stepper-li-active':'stepper-li'}>
            <span className={props.ifActive.step4?'stepper-span-active':'stepper-span'}>
                4
            </span>
            <span>
                <h3 className="font-semibold leading-tight">Review</h3>
            </span>
        </li>
    </ol>
    </div>
  )
}
