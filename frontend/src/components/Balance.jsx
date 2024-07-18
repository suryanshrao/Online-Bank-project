export const Balance = function({value}){
    return <div className="flex">
        <div className="font-bond text-lg">
            Your Balance
        </div>
        <div className="font-semibold ml-4 text-lg">
            Rs {value}            
        </div>
    </div>
}