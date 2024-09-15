'use server'; //! you mark all the exported functions within the file as Server Actions. These server functions can then be imported and used in Client and Server components.

//! type validator
// In your actions.ts file, import Zod and define a schema that matches the shape of your form object. This schema will validate the formData before saving it to a database.

import { sql } from '@vercel/postgres';
import { z } from 'zod'; //! we can use Zod to validate form data


//! Revalidate and redirect
//* Next.js has a Client-side Router Cache that stores the route segments in the user's browser for a time. Along with prefetching, this cache ensures that users can quickly navigate between routes while reducing the number of requests made to the server.

//* Since you're updating the data displayed in the invoices route, you want to clear this cache and trigger a new request to the server. You can do this with the revalidatePath function from Next.js:
import { revalidatePath } from 'next/cache';

//! re direct to a specific path (server side)
import { redirect } from 'next/navigation';

// ------ // 
//* esta parte es para la accion del log in con auth
// connect the auth logic with your login form. 
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// ------ // 

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.', //  Zod already throws an error if the customer field is empty as it expects a type string. But let's add a friendly message if the user doesn't select a customer.
    }),
    amount: z.coerce.number() //The amount field is specifically set to coerce (change) from a string to a number while also validating its type.
    .gt(0, { message: 'Please enter an amount greater than $0.' }), // Since you are coercing the amount type from string to number, it'll default to zero if the string is empty. Let's tell Zod we always want the amount greater than 0 with the .gt() function.
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.', // Zod already throws an error if the status field is empty as it expects "pending" or "paid". Let's also add a friendly message if the user doesn't select a status.
    }),
    date: z.string(),
  });

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = { // este estado del manejo del error se usa para el tipo de dato y objeto que pasamos al validar datos en el server
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
  };
 
// export async function createInvoice(formData: FormData) { ANTES DE LA VALIDACION EN SERVER
export async function createInvoice(prevState: State, formData: FormData) {
 // formData - same as before.
 // prevState - contains the state passed from the useActionState hook. You won't be using it in the action in this example, but it's a required prop.

    //* pass your rawFormData to CreateInvoice to validate the types:
    
    // const rawFormData = { antes de validar
    // const { customerId, amount, status } = CreateInvoice.parse({ ANTES DEL VALIDATE
    const validatedFields = CreateInvoice.safeParse({ //* safeParse() will return an object containing either a success or error field. This will help handle validation more gracefully without having put this logic inside the try/catch block.
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });

      console.log(validatedFields) 
      //! since you're handling form validation separately, outside your try/catch block, you can return a specific message for any database errors, your final code should look like this:

      // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

      // Test it out:
    //   console.log(rawFormData);
    //   console.log(typeof rawFormData.amount);

     //* Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    //* Insert data into the database
try {
    //UNA VEZ QUE RECIBIMOS LA DATA Y LA VALIDAMOS LOS TIPOS LA PODEMOS MANDAR A LA DB
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;

} catch(error) {
      //* If a database error occurs, return a more specific error.
    return {
        message: 'Database Error: Failed to Create Invoice.',
      };
}

// Revalidate the cache for the invoices page and redirect the user.
  //* Once the database has been updated, the /dashboard/invoices path will be revalidated, and fresh data will be fetched from the server.
  revalidatePath('/dashboard/invoices');


    //*At this point, you also want to redirect the user back to the /dashboard/invoices page. You can do this with the redirect function from Next.js:
    redirect('/dashboard/invoices');

}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
 
//? step by step updateInvoice
// 1 Extracting the data from formData.
// 2 Validating the types with Zod.
// 3 Converting the amount to cents.
// 4 Passing the variables to your SQL query.
// 5 Calling revalidatePath to clear the client cache and make a new server request.
// 6 Calling redirect to redirect the user to the invoice's page.

export async function updateInvoice( id: string,
    prevState: State,
    formData: FormData,) { //! tuve un error tremendo por el orden de estos argumentos, tienen que ir de esta manera o da error , me imagino que la funcion esta recibe ID pero despues se usa en el useActionState para manejar errores que activa la funcion que a su vez envia el initialState entonces debe estar en segundo lugar, imagino

//* antes de validar data
// const { customerId, amount, status } = UpdateInvoice.parse({
//     customerId: formData.get('customerId'),
//     amount: formData.get('amount'),
//     status: formData.get('status'),
//   });


    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });

      console.log(validatedFields) 
      //! since you're handling form validation separately, outside your try/catch block, you can return a specific message for any database errors, your final code should look like this:

      if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Update Invoice.',
        };
      }


    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
 
  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');  //! Note how redirect is being called outside of the try/catch block. This is because redirect works by throwing an error, which would be caught by the catch block. To avoid this, you can call redirect after try/catch. redirect would only be reachable if try is successful.
}

// delete

// Since this action is being called in the /dashboard/invoices path, you don't need to call redirect. Calling revalidatePath will trigger a new server request and re-render the table.
export async function deleteInvoice(id: string) {

    //? ERROR DE PRUEBA
    //* throw new Error('Failed to Delete Invoice');

    // When you try to delete an invoice, you should see an error on localhost. Ensure that you remove this error after testing and before moving onto the next section.
    // Seeing these errors are helpful while developing as you can catch any potential problems early. However, you also want to show errors to the user to avoid an abrupt failure and allow your application to continue running.
    // This is where Next.js error.tsx file comes in.

    //* ==> Handling all errors with error.tsx
    //* The error.tsx file can be used to define a UI boundary for a route segment. It serves as a catch-all for unexpected errors and allows you to display a fallback UI to your users.

    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice.' };
    }catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' }; //* en este a diferencia del anterior no hay redirect entonces podemos poner dentro del try
      }    
  }


  // ----- //
//* new action called authenticate. This action should import the signIn function from auth.ts:
export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin': // If there's a 'CredentialsSignin' error, you want to show an appropriate error message
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }
  // ----- //
