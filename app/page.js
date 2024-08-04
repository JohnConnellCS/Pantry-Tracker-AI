'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
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
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
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
                setQuantity('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            My Pantry
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Stack direction={'row'} spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => addItem(name, 1)}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => removeItem(name, 1)}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}