// export const globalUrl = 'http://localhost:1337/api/'
export const globalUrl = 'https://api.mstf0freelance.store/api/'
export const appIdentifier = 'installmentApp'
export const appName = 'نظام البيع بالتقسيط'
export const dateFormat = 'YYYY-MM-DD -  hh:mm'

export const userTypes = [
    {title:'شخصي', value:'individual'},
    {title:'شركة', value:'company'},
    {title:'مؤسسة حكومية', value:'government'},
    {title:'خدمات و طوارئ', value:'rescue'},
]


export const saveLocal = (itemName,data)=>{
    const jsonData = JSON.stringify(data)
    localStorage.setItem(itemName,jsonData);
    return true
}

export const getLocal = (itemName)=>{
    const data = localStorage.getItem(itemName);
    const parsedData = JSON.parse(data)
    return parsedData
}


export const removeLocal = (itemName, callback)=>{
   localStorage.removeItem(itemName)
   callback()
}


export const getData = (name, callback) => {
    fetch(globalUrl + name)
      .then((resp) => resp.json())
      .then((jsonData) => callback(jsonData))
      .catch((err) => console.log(err));
  };


export const getDataWithToken = (name, callback) => {
    const token = getLocal(appIdentifier)?.jwt ; 
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}` );

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

    fetch(globalUrl + name, requestOptions)
      .then((resp) => resp.json())
      .then((jsonData) => callback(null, jsonData))
      .catch((err) => callback(err, null));
  };




  export const addData = (name,data, callback) => {
    let options = {
        method: "post",
        headers: {
        "Content-Type": "application/json",
        
        },
        body: JSON.stringify(data),
    };
    fetch(globalUrl + name, options)
        .then((resp) => resp.json())
        .then((jsonData) => callback(null, jsonData))
        .catch((err) => callback(err, null));
    };


  export const addDataWithToken = (name,data, callback) => {
    const token = getLocal(appIdentifier)?.jwt ; 

    var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
    let options = {
        method: "post",
        headers: myHeaders,
        body: JSON.stringify({data}),
    };
    console.log(options);
    fetch(globalUrl + name, options)
        .then((resp) => resp.json())
        .then((jsonData) => callback(null, jsonData))
        .catch((err) => callback(err, null));
    };

    export const addDataWithTokenAdmin = (name,data, callback) => {
        const token = getLocal(appIdentifier)?.jwt ; 
    
        var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);
            myHeaders.append("Content-Type", "application/json");
        let options = {
            method: "post",
            headers: myHeaders,
            body: JSON.stringify({...data}),
        };
        console.log(options);
        fetch(globalUrl + name, options)
            .then((resp) => resp.json())
            .then((jsonData) => callback(null, jsonData))
            .catch((err) => callback(err, null));
        };


  export const deleteDataWithToken = (name, callback) => {
    const token = getLocal(appIdentifier)?.jwt ; 

    var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
          };

    fetch(globalUrl + name, requestOptions)
        .then((resp) => resp.json())
        .then((jsonData) => callback(null, jsonData))
        .catch((err) => callback(err, null));
    };


    export const editDataWithToken = (name,data, callback) => {
        const token = getLocal(appIdentifier)?.jwt ; 
    
        var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);
            myHeaders.append("Content-Type", "application/json");
        let options = {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify({data}),
        };
        console.log(options);
        fetch(globalUrl + name, options)
            .then((resp) => resp.json())
            .then((jsonData) => callback(null, jsonData))
            .catch((err) => callback(err, null));
        };

    export const editDataWithTokenAdmins = (name,data, callback) => {
        const token = getLocal(appIdentifier)?.jwt ; 
    
        var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);
            myHeaders.append("Content-Type", "application/json");
        let options = {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify({...data}),
        };
        console.log(options);
        fetch(globalUrl + name, options)
            .then((resp) => resp.json())
            .then((jsonData) => callback(null, jsonData))
            .catch((err) => callback(err, null));
        };

    
    