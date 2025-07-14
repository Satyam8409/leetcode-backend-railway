/*Function Explanation
const getlanguageById = (lang) => {
    const language = {
        "c++": 54,
        "java": 62,
        "javascript": 63,
    };
    return language[lang];
}
How It Works
Function Definition:
getlanguageById is a function that takes one argument: lang (a string like "c++", "java", or "javascript").

Object Mapping:
Inside the function, there's an object called language that maps language names (as strings) to numeric IDs.
{
  "c++": 54,
  "java": 62,
  "javascript": 63
}
Return Value:
The function returns the value associated with the lang key using bracket notation: language[lang].

console.log(getlanguageById("c++"));        // Output: 54
console.log(getlanguageById("java"));       // Output: 62
console.log(getlanguageById("javascript")); // Output: 63
consol

*/

/* Advantages of Axios over Fetch
1.Automatic JSON Parsing
    axios automatically parses JSON responses.
    fetch requires .then(res => res.json()).

2.Better Error Handling
    axios treats non-2xx responses as errors.
    fetch does not throw errors for HTTP errors (e.g., 404).

3.Request & Response Interceptors
    axios supports interceptors to modify requests or responses globally.
    fetch has no built-in support.

4.Supports Timeout Easily
    axios supports request timeouts natively.
    fetch requires manual AbortController.

5.Cleaner Syntax
    axios code is shorter and more readable.

6.Built-in baseURL & Headers
    You can configure a base URL and headers globally in axios.

7.Supports Form Data & Multipart Uploads Easily
    Easier to handle FormData, file uploads, etc.

8.Tracks Upload/Download Progress
    axios has onUploadProgress and onDownloadProgress.

9.Browser Compatibility
    axios works with older browsers (with polyfill).
    fetch is not supported in older browsers like IE.

10.eg
    const resp=await fetch('https://api.eg.com/data');
    const data=await resp.json() //extra step

    const resp=await axios.get('https://api.eg.com/data')
    console.log(resp) //no need to parse data manually


*/



const axios=require('axios')

const getlanguageById=(lang)=>{
    const language={
        "cpp":54,
        "java":62,
        "javascript":63,
    }
    return language[lang.toLowerCase()];
    // return language.lang;//is will be wrong bcz lang is parameter

}


/*isse format me token as a response bhejega
[
  {
    "token": "db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"
  },
  {
    "token": "ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1"
  },
  {
    "token": "1b35ec3b-5776-48ef-b646-d5522bdeb2cc"
  }
]     

*/
const submitBatch=async (submission)=>{
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',//url jaha pe submit krge
        params: {
          base64_encoded: 'false'
        },
        headers: {
          'x-rapidapi-key': '5f3ac85089mshe26813342f616b2p188b67jsna735637faff4',
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        //apna formta wala batch submission yaha pe dal diye
        data: {
          submissions:submission
        }
    };

    async function fetchData() {
    	try {
    		const response = await axios.request(options);//option me sb diya hai post hai ya get etc 
    		console.log(response.data);
            return response.data;//isme hai ky-->array of token lake dega(direct result kyu nhi diya taki user ko wait na krna pre ,judge0 token de diya aab sent batch ko run kra raha hai,jb user token lake dega to uuse me batayega sara chez like ...time space status), jitna v batch hai utna hi token hoga array me //token ko fir juge0 ko dena hoga fir o data send krega uske agar status_id agar 3 to accepted ,4 wrong ans 
    	} 
        catch (error) {
    		console.error(error);
    	}
    }
    return await fetchData();//ye return ky krwa raha hai

}




const waiting=async (timer)=>{
  setTimeout(()=>{
    return 1;
  },timer)
}

/*ye format me data as a response ye bhejega
{
  "submissions": [
    {
      "language_id": 46,
      "stdout": "hello from Bash\n",
      "status_id": 3,
      "stderr": null,
      "token": "db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"
    },
    {
      "language_id": 71,
      "stdout": "hello from Python\n",
      "status_id": 3,
      "stderr": null,
      "token": "ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1"
    }
  ]
}

*/
const submitToken=async (resultToken)=>{
  const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      // tokens: 'dce7bbc5-a8c9-4159-a28f-ac264e48c371,1ed737ca-ee34-454d-a06f-bbc73836473e,9670af73-519f-4136-869c-340086d406db',
      tokens:resultToken.join(','), //array ko string me convert kiye with , separated ise line se
      base64_encoded: 'false',
      fields: '*'
    },
    headers: {
      'x-rapidapi-key': '5f3ac85089mshe26813342f616b2p188b67jsna735637faff4',
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    }
  };

  async function fetchData() {
  	try {
  		const response = await axios.request(options);
  		console.log(response.data);
      return response.data;
  	} 
    catch (error) {
  		console.error(error);
  	}
  }

  while(true){
    const result= await fetchData();
    console.log(result);
    

    /*how .every works-even a single false it stops and return false, or check all if true then return true, map can't do this it will return array of t/f for each val
    .every() takes the first item: {status_id: 3} → 3 > 2 → ✅
              Takes the second item: {status_id: 3} → 3 > 2 → ✅
              Takes the third item: {status_id: 3} → 3 > 2 → ✅
              All passed → returns true */
    const isResult=result?.submissions?.every(val=>val.status_id>2);
    if(isResult)
      return result.submissions;

    await waiting(1000);
  }
  
}





module.exports={getlanguageById, submitBatch, submitToken};








/*create a batch submition sending format
const axios = require('axios');

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'true'
  },
  headers: {
    'x-rapidapi-key': '5f3ac85089mshe26813342f616b2p188b67jsna735637faff4',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions: [
      {
        language_id: 46,
        source_code: 'ZWNobyBoZWxsbyBmcm9tIEJhc2gK'
      },
      {
        language_id: 71,
        source_code: 'cHJpbnQoImhlbGxvIGZyb20gUHl0aG9uIikK'
      },
      {
        language_id: 72,
        source_code: 'cHV0cygiaGVsbG8gZnJvbSBSdWJ5IikK'
      }
    ]
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		console.log(response.data);
	} catch (error) {
		console.error(error);
	}
}

fetchData();
*/

/*get a batch submission -->ye token(uper wala fn token dega) leke status etc bhejega
const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: 'dce7bbc5-a8c9-4159-a28f-ac264e48c371,1ed737ca-ee34-454d-a06f-bbc73836473e,9670af73-519f-4136-869c-340086d406db',
    base64_encoded: 'true',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': '5f3ac85089mshe26813342f616b2p188b67jsna735637faff4',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		console.log(response.data);
	} catch (error) {
		console.error(error);
	}
}

fetchData();

*/




