
import { TextField } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import Wallet from "~/components/Wallet";
import { fetchNFTDatas, useTokiemonBalance, useUserTokenIds } from "~/utils/tokiemon";

export function Welcome() {
  const { address } = useAccount()
  const sampleUserAddress = "0x982f971cf283AF08C811D7bC15212aE0df298C64"
  const { balance } = useTokiemonBalance(sampleUserAddress)
  const { data: tokenIds, isLoading: isLoadingTokenIds } = useUserTokenIds(sampleUserAddress, balance)
  const [rows, setRows] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [filterString, updateFilterString] = useState("");

  useEffect(() => {
    if (!isLoadingTokenIds && tokenIds.length > 0) {
      setLoading(true)
      const currentTokens = tokenIds
        .map(tokenId => tokenId.result)

      fetchNFTDatas(currentTokens).then(datas => {
        setRows(datas.filter((data: any) => !data.error))
        setLoading(false)
      })
    }
  }, [isLoadingTokenIds, tokenIds]);


  const columns: GridColDef[] = [
    { field: 'image', headerName: '', renderCell: (params) => <img src={params.value} alt="NFT" className="w-16 h-16 object-cover" />, width: 50, sortable: false },
    { field: 'tokenId', headerName: 'ID', width: 70, sortable: true },
    { field: 'chainId', headerName: 'ChainID', width: 70, sortable: false },
    { field: 'name', headerName: 'Name', width: 100, sortable: true },
    { field: 'description', headerName: 'Description', flex: 1, sortable: false },
    { field: 'attributes', headerName: 'Attributes', renderCell: (params) => <div>{params.value.map((item: any, idx: number) => <p key={`attribute_${idx}`}>{item.trait_type} : {item.value}</p>)}</div>, flex: 1, sortable: false },
  ];

  const paginationModel = { page: 0, pageSize: 5 };


  const filteredRows = useMemo(() => {
    return rows.filter(row => row.name.toLowerCase().includes(filterString.toLowerCase()) || row.description.toLowerCase().includes(filterString.toLowerCase()))
  }, [rows, filterString])

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <Wallet />
        {address && <>

          {isLoading || isLoadingTokenIds ? (
            <p className="text-lg text-gray-500">Loading your Tokiemon...</p>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className='w-full p-4 flex items-end justify-end'>
                <TextField
                  id="outlined-basic"
                  label="Search"
                  variant="outlined"
                  placeholder='Search by name or description'
                  value={filterString}
                  onChange={(e) => updateFilterString(e.target.value)}
                  color="success"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white !important"
                    },
                    "& .MuiOutlinedInput-input": {
                      color: "white !important"
                    },
                    "& .MuiInputLabel-root": {
                      color: "white !important"
                    }
                  }}
                />
              </div>

              <DataGrid
                rows={filteredRows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                sx={{
                  width: "100%",
                  minWidth: "1000px",
                  color: "white",
                  "& .MuiDataGrid-cell": {
                    color: "white",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    display: "flex",
                    alignItems: "center"
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    color: "black",
                  },
                  "& .MuiTablePagination-root": {
                    color: "white"
                  },
                  backgroundColor: "#121212", // Optional: dark background
                }}
                getRowId={(row) => row.tokenId}
                disableColumnFilter
                disableColumnResize
                disableColumnSelector
                getRowHeight={() => "auto"} // Enables auto height for rows
              />
            </div>
          )}
        </>}
      </div>
    </main>
  );
}