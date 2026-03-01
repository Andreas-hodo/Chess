        class ChessDB{
            constructor(dbName = "AppDB",storeName = "store"){
                this.dbName = dbName
                this.storeName = storeName
                this.db = null
            }
            async init(){
                return  new Promise((resolve, reject) => {
                    const request = indexedDB.open(this.dbName,1)
                    request.onupgradeneeded = e =>{
                        const db = e.target.result
                        if(!db.objectStoreNames.contains(this.storeName)){
                            db.createObjectStore(this.storeName)

                        }
                    }
                    request.onsuccess = e =>{
                        this.db = e.target.result
                        resolve()
                    }
                    request.onerror = e => reject(e)
                })
                }
                 _tx(mode){
                    return this.db.transaction(this.storeName,mode).objectStore(this.storeName)
                }
                async set(key,value){
                    return new Promise((resolve, reject) => {
                        const request = this._tx("readwrite").put(value,key)
                        request.onsuccess = () => resolve()
                        request.onerror = e => reject(e)
                    })
                }
                async get(key){
                    return new Promise((resolve, reject) => {
                        const request = this._tx("readonly").get(key)
                        request.onsuccess = () => resolve(request.result)
                        request.onerror = e => reject(e)
                    })
                }
                async delete(key){
                    return new Promise((resolve, reject) => {
                        const request = this._tx("readwrite").delete(key)
                        request.onsuccess = () => resolve()
                        request.onerror = e => reject(e)
                    })
                }
                async clear(){
                    return new Promise((resolve, reject) => {
                        const request = this._tx("readwrite").clear()
                        request.onsuccess = () => resolve()
                        request.onerror = e => reject(e)
                    })
                }
                collectData(){
                    let turn = document.getElementById("turn").innerText
                    let promotionElem = document.getElementById("promotion").style.display
                    let promotion = promotionElem ? promotionElem : "none"
                    let boardObject = board
                    let players = {player_1,player_2}
                    return {turn,promotion,boardObject,players}
                }
        }
        console.log(board)
        let mydb = new ChessDB("Chess","Data")
        mydb.init().then(()=>{
           mydb.set("GameState",mydb.collectData()) 
           console.log(mydb.get("GameState").then(data =>{
            console.log(data)
           }))
        })