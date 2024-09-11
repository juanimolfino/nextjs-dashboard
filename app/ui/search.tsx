'use client'; // - This is a Client Component, which means you can use event listeners and hooks.

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDebouncedCallback } from 'use-debounce'; // By debouncing, you can reduce the number of requests sent to your database, thus saving resources. That's right! Debouncing prevents a new database query on every keystroke, thus saving resources.
import { useSearchParams, 
  usePathname, useRouter } from 'next/navigation';


export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();

  const pathname = usePathname();
  const { replace } = useRouter();

const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`); //!Best practice: Debouncing
    //* You're updating the URL on every keystroke, and therefore querying your database on every keystroke! This isn't a problem as our application is small, but imagine if your application had thousands of users, each sending a new request to your database on each keystroke.
    //! Debouncing is a programming practice that limits the rate at which a function can fire. In our case, you only want to query the database when the user has stopped typing.

    //? Cómo funciona la función de eliminación de rebotes:
      //* Evento desencadenante: cuando se produce un evento que debe eliminarse mediante la función de eliminación de rebotes (como una pulsación de tecla en el cuadro de búsqueda), se inicia un temporizador.
      //* Espera: si se produce un nuevo evento antes de que finalice el temporizador, este se reinicia.
      //* Ejecución: si el temporizador llega al final de su cuenta regresiva, se ejecuta la función de eliminación de rebotes.

      //! benefits of using URL search params and lifting this state to the server.
    const params = new URLSearchParams(searchParams); // URLSearchParams is a Web API that provides utility methods for manipulating the URL query parameters. Instead of creating a complex string literal, you can use it to get the params string like ?page=1&query=a.
    params.set('page', '1'); // aca fijo en la URL el param 'page=1'. siempre que haya una nueva busqueda en el input se pone page=1. sin esto una nueva busqueda no arrojara nada si tiene menos de 6 items y estas parado en la page 2 por ejemplo
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`); //* You're using the useRouter router hook for smoother, client-side transitions.
  }, 300); //This function will wrap the contents of handleSearch, and only run the code after a specific time once the user has stopped typing (300ms).
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()} // To ensure the input field is in sync with the URL and will be populated when sharing, you can pass a defaultValue to input by reading from searchParams:
        // defaultValue vs. value / Controlled vs. Uncontrolled: If you're using state to manage the value of an input, you'd use the value attribute to make it a controlled component. This means React would manage the input's state.However, since you're not using state, you can use defaultValue. This means the native input will manage its own state. This is okay since you're saving the search query to the URL instead of state.
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
