// import { useState, useEffect } from 'react'
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   TextField,
//   InputAdornment,
//   SvgIcon,
//   Typography
// } from '@mui/material';

// import { Search as SearchIcon } from '../../icons/search';
// import NextLink from 'next/link';

// import axios from 'axios';
// const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_VOTING_SERVICE });


// export const ElectionListToolbar = ({ setElections, setCount }) => {
//   const [search, setSearch] = useState();

//   useEffect(() => {
//     fetchElections();
//   }, [search])

//   const fetchElections = async() => {
//     let token = localStorage.getItem("accessToken");
//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       },
//     };

//     try {
//       const res = await API.get(
//           `/elections?page=1&title=${search}`,
//           config
//         );
//       setElections(res.data.data);
//       setCount(res.data.numberOfPages);
//     }
//     catch(err) {
//       if(err.response.status === 401) {
//         localStorage.clear();
//         alert("Your session has expired");
//         router.push('/login')
//         // refreshAccessToken();
//       }
//     }
//   }

//   return (
//   <Box>
//     <Box
//       sx={{
//         alignItems: 'center',
//         display: 'flex',
//         justifyContent: 'space-between',
//         flexWrap: 'wrap',
//         m: -1
//       }}
//     >
//       <Typography
//         sx={{ m: 1 }}
//         variant="h4"
//       >
//         Browse elections
//         {search}
//       </Typography>
//       <Box sx={{ m: 1 }}>
//           <NextLink
//             href="/host"
//             passHref
//           >
//             <Button
//               component="a"
//               color="primary"
//               variant="contained"
//             >
//               Host new election
//             </Button>
//           </NextLink>
//       </Box>
//     </Box>
//     <Box sx={{ mt: 3 }}>
//       <Card>
//         <CardContent>
//           <Box sx={{ maxWidth: 500 }}>
//             <TextField
//               fullWidth
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SvgIcon
//                       fontSize="small"
//                       color="action"
//                     >
//                       <SearchIcon />
//                     </SvgIcon>
//                   </InputAdornment>
//                 )
//               }}
//               placeholder="Search..."
//               variant="outlined"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   </Box>
// )};
