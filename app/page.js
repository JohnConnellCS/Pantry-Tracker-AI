'use client'

import { useState, useEffect } from 'react'
import { Box, Button, Modal, Stack, TextField, Typography, IconButton } from '@mui/material'
import { firestore } from '@/firebase'
import { fetchRecipes } from '@/app/openai'; // Import the fetchRecipes function
import DeleteIcon from '@mui/icons-material/Delete'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [removeQuantity, setRemoveQuantity] = useState(0)
  const [showForm, setShowForm] = useState(false);
  const [recipes, setRecipes] = useState('');


  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }
  
  useEffect(() => {
    updateInventory()
  }, [])

  const getRecipes = async () => {
    const ingredients = inventory.map(item => item.name);
    const key = ingredients.join(',');
    const fetchedRecipes = await fetchRecipes(ingredients);
    setRecipes(fetchedRecipes);
  };
  
  const handleQuantityChange = (e) => {
    const value = e.target.value
    // Set quantity to the input value if it's a valid number, otherwise reset to 0
    const parsedValue = Number(value)
    setQuantity(isNaN(parsedValue) ? 0 : parsedValue)
  }

  const addItem = async (item, quantity) => {
    const parsedQuantity = Number(quantity)
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      console.log("Quantity must be a positive number");
      setQuantity(0) // Reset the quantity to 0
      return
    }
    
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity: existingQuantity } = docSnap.data()
      await setDoc(docRef, { quantity: parsedQuantity + existingQuantity })
    } else {
      await setDoc(docRef, { quantity: parsedQuantity })
    }
    await updateInventory()
  }


  const handleRemoveQuantityChange = (e) => {
    const value = e.target.value
    // Set removeQuantity to the input value if it's a valid number, otherwise reset to 0
    const parsedValue = Number(value)
    setRemoveQuantity(isNaN(parsedValue) ? 0 : parsedValue)
  }
  
  const removeItem = async (name, removeQuantity) => {
    if (removeQuantity <= 0) {
      console.log("Remove quantity must be a positive number")
      return
    }
  
    const docRef = doc(collection(firestore, 'inventory'), name)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      const newQuantity = quantity - removeQuantity
  
      if (newQuantity > 0) {
        await setDoc(docRef, { quantity: newQuantity })
      } else {
        await deleteDoc(docRef)
      }
  
      await updateInventory()
    }
  }
  
  
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)



  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      bgcolor="#202225"
      padding={2}
    >
      {/* Top Section */}
      <Box textAlign="center" marginBottom={4} >
        <Typography variant="h3" color="#ffffff">Pantry Tracker AI</Typography>
        <Typography variant="h6" color="#ffffff">Manage your Inventory and AI-Powered Recommendations</Typography>
      </Box>

      {/* Main Content */}
      <Box display="flex" flex="1">
        {/* Left Column */}
        <Box 

          width="50%"
          display="flex"
          flexDirection="column"
          padding={2}
          bgcolor="292225"
          gap={2}
        >
          {/* Add Item Section */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={1}
          >
            <Typography variant="h6" color="#ffffff">Update Inventory</Typography>
            <Box
              display="flex"
              justifyContent="center"
              width="100%"
            >
              <Button
                variant="contained"
                onClick={() => setShowForm(true)}
                sx={{
                  width: '20%',
                  bgcolor: '#5865F2', 
                  '&:hover': {
                    bgcolor: '#4752C4', 
                  },
                }}
              >
                Add Items
              </Button>
            </Box>
          </Box>
            
          {/* Form Pop Up */}

          {showForm && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'white', 
                border: '.5px solid #000',
                boxShadow: 24,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                zIndex: 10,
              }}
            >
              <Typography variant="h6" component="h2">
                Add Item
              </Typography>
              <Stack width="100%" direction="row" spacing={2}>
                <TextField
                  id="outlined-basic"
                  label="Item"
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <TextField
                  id="outlined-quantity"
                  label="Quantity"
                  variant="outlined"
                  fullWidth
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    addItem(itemName, Number(quantity));
                    setItemName('');
                    setQuantity(1);
                    setShowForm(false);
                  }}
                  sx={{
                    bgcolor: '#5865F2',
                    '&:hover': {
                      bgcolor: '#4752C4',
                    },
                  }}
                >
                  Add
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setShowForm(false)}
                  sx={{
                    bgcolor: '#b9bbbe', // Gray background for the cancel button
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          )}

           {/* Future Content Section */}
           <Box
            flex="1"
            bgcolor='#36393f' 
            borderRadius={1}
            padding={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Button
              variant="contained"
              onClick={getRecipes}
              sx={{
                bgcolor: '#5865F2',
                '&:hover': {
                  bgcolor: '#4752C4',
                },
              }}
            >
              Get Recipes
            </Button>
            <Box
              bgcolor='#36393f'
              color = "#ffffff"
              component="div"
              dangerouslySetInnerHTML={{ __html: recipes || "No recipes yet. Click 'Get Recipes' to find recipes based on your ingredients!" }}
              />            
          </Box>
        </Box>

        {/* Right Column */}
        <Box
          width="50%"
          display="flex"
          flexDirection="column"
          padding={2}
          bgcolor="292225"
        >
          {/* Pantry Items */}
          <Box
            width="100%"
            bgcolor={'#36393f'}
            padding={2}
            textAlign={'center'}
            marginBottom={2}
            borderRadius={1}
          >
            <Typography variant={'h4'} color={'#ffffff'}>
              Current Ingredients
            </Typography>
          </Box>
          <Stack width="100%" spacing={2} overflow={'auto'}>
            {inventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'#36393f'}
                paddingX={5}
                borderRadius={1}
                position="relative"
              >
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8, // Adjust as needed
                    right: 8, // Adjust as needed
                    color: '#ffffff', // Set icon color
                    '&:hover': {
                      color: '#ff0000', // Optional: Change color on hover
                    },
                  }}
                  onClick={() => removeItem(name, quantity)} // Adjust as needed
                >
                  <DeleteIcon />
                </IconButton>
                <Typography variant={'h6'} color={'#ffffff'} textAlign={'center'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={'h6'} color={'#ffffff'} textAlign={'center'}>
                  Quantity: {quantity}
                </Typography>
                <Stack direction={'row'} spacing={2}>
                  <Button
                    variant="contained"
                    onClick={() => addItem(name, 1)}
                    sx={{
                      bgcolor: '#5865F2', 
                      '&:hover': {
                        bgcolor: '#4752C4', 
                      },
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => removeItem(name, 1)}
                    sx={{
                      bgcolor: '#5865F2', 
                      '&:hover': {
                        bgcolor: '#4752C4',
                      },
                    }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

      <Modal
  open={open}
  onClose={() => setOpen(false)}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
    <Typography id="modal-modal-title" variant="h6" component="h2">
      Add Item
    </Typography>
    <Stack width="100%" direction={'row'} spacing={2}>
      <TextField
        id="outlined-basic"
        label="Item"
        variant="outlined"
        fullWidth
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <TextField
        id="outlined-quantity"
        label="Quantity"
        variant="outlined"
        fullWidth
        value={quantity}
        onChange={handleQuantityChange}
      />
      <Button
        variant="outlined"
        onClick={() => {
          addItem(itemName, Number(quantity))
          setItemName('')
          setQuantity(1)
          setOpen(false)
        }}
      >
        Add
      </Button>
    </Stack>
  </Box>
</Modal>


    </Box>
  )
}