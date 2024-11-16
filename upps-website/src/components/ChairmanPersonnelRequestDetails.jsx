import  Button  from "../components/Button";
export const ChairmanPersonnelRequestDetails = ({requestType, duplex, noPages, paperSize, file, openFile}) =>{

    return(
        <div className="personnel-request-details-content ml-10 mt-3 mb-10">
              <div className="flex flex-col">
                <p>{requestType}</p>
                <div className="flex  justify-between items-center">
                  <div className="flex">
                    <p className="text-[clamp(1rem,3vw,1rem)]">{`${duplex}, ${noPages} pages, ${paperSize}`}</p>
                  </div>
                  <Button title={file} style={"bg-[#17155a] text-white px-[0.5rem] rounded-[4px]"} onClick={openFile}></Button>
                </div>
              </div>
              <a href="View File"></a>
        </div>        
    )
}