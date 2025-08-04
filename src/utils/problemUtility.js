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
    const isResult=result?.submissions?.every(val=>val.status_id>2);
    if(isResult)
      return result.submissions;
    await waiting(1000);
  }
  
}
module.exports={getlanguageById, submitBatch, submitToken};









