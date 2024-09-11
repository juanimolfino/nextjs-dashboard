'use client'; // we use this for the hook useActionState

import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createInvoice, State } from '@/app/lib/actions'; // State tiene los tipos de datos para el initialState de la validation 
import { useActionState } from 'react'; //Takes two arguments: (action, initialState).
// Returns two values: [state, formAction] - the form state, and a function to be called when the form is submitted.

export default function Form({ customers }: { customers: CustomerField[] }) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createInvoice, initialState);
 //* Pass your createInvoice action as an argument of useActionState, and inside your <form action={}> attribute, call formAction.
 //* The initialState can be anything you define, in this case, create an object with two empty keys: message and errors, and import the State type from your actions.ts file:

 //! display the errors in your form component. Back in the create-form.tsx component, you can access the errors using the form state.

 console.log(state, 'soy el state del useActionState para el form validation')

  return (

    //* ABOUT ACTION IN FORM USING IN NEXT JS/REACT:
    // Good to know: In HTML, you'd pass a URL to the action attribute. This URL would be the destination where your form data should be submitted (usually an API endpoint).

    //However, in React, the action attribute is considered a special prop - meaning React builds on top of it to allow actions to be invoked.

    //Behind the scenes, Server Actions create a POST API endpoint. This is why you don't need to create API endpoints manually when using Server Actions.

    //<form action={createInvoice}> este es antes de validar en el server con useActionState 
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
                aria-describedby="customer-error" // especificación ARIA (Accessible Rich Internet Applications) que se usa para asociar un elemento con un elemento de texto adicional que proporciona una descripción o información contextual
              //*Propósito: El atributo aria-describedby se usa para proporcionar una descripción adicional sobre el elemento al que se aplica. Este atributo suele apuntar al id de otro elemento en la página que contiene la descripción o la información adicional.

              //* Valor: El valor del atributo aria-describedby es el id de uno o varios elementos HTML que proporcionan la descripción o información adicional. En tu caso, "customer-error" es el valor, lo que significa que el elemento con el id="customer-error" proporciona una descripción para el elemento <select>.
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {/* aca mostramos el error asociado a customer */}
            <div id="customer-error" aria-live="polite" aria-atomic="true">
                {state.errors?.customerId &&
                  state.errors.customerId.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
            </div>

            {/* aria-describedby="customer-error": This establishes a relationship between the select element and the error message container. It indicates that the container with id="customer-error" describes the select element. Screen readers will read this description when the user interacts with the select box to notify them of errors. */}
              {/* id="customer-error": This id attribute uniquely identifies the HTML element that holds the error message for the select input. This is necessary for aria-describedby to establish the relationship. */}
                {/* aria-live="polite": The screen reader should politely notify the user when the error inside the div is updated. When the content changes (e.g. when a user corrects an error), the screen reader will announce these changes, but only when the user is idle so as not to interrupt them.
 */}
        </div>

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                //required // The simplest would be to rely on the form validation provided by the browser by adding the required attribute. The browser will display a warning if you try to submit a form with empty values
                //! but this one is client side validation

                //! this is for server validation
                aria-describedby="amount-error" 
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="amount-error" aria-live="polite" aria-atomic="true">
                {state.errors?.amount &&
                  state.errors.amount.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
            </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error" 
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
                {state.errors?.status &&
                  state.errors.status.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
            </div>
        </fieldset>
      </div>
      {state.errors ? <div>{state.message}</div> : <></>}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Invoice</Button>
      </div>
    </form>
  );
}


//! Improving form accessibility
// There are three things we're already doing to improve accessibility in our forms:

//* Semantic HTML: Using semantic elements (<input>, <option>, etc) instead of <div>. This allows assistive technologies (AT) to focus on the input elements and provide appropriate contextual information to the user, making the form easier to navigate and understand.
//* Labelling: Including <label> and the htmlFor attribute ensures that each form field has a descriptive text label. This improves AT support by providing context and also enhances usability by allowing users to click on the label to focus on the corresponding input field.
//* Focus Outline: The fields are properly styled to show an outline when they are in focus. This is critical for accessibility as it visually indicates the active element on the page, helping both keyboard and screen reader users to understand where they are on the form. You can verify this by pressing tab.
//These practices lay a good foundation for making your forms more accessible to many users. However, they don't address form validation and errors.