import { useEffect, useState } from 'react';

import { AddCircleOutline, RemoveCircleOutline, Edit, ExpandMore, ExpandLess} from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  TextField,
} from '@mui/material';

import Slide from '../components/Slide';

const slidesProp = [
  { title: 'First Slide', img: "https://ipfs.io/ipfs/QmaYSTTQQLQZJTFdQAHPggKALuk7WYcu3zSYDazVZBgWs1", msg: 'We are gonna make' },
  { title: 'Second Slide', img: "https://ipfs.io/ipfs/QmeAP2RBjug2aVLHhk99nKJDxa7RPyBFG4mf59VmUoyZ5h", msg: 'We are gonna make' },
  { title: 'Third Slide', img: "https://ipfs.io/ipfs/QmQdQUqRqbm5hHexhuBa26pw5wAYkzf2rL76si6WM7Eo28", msg: 'We are gonna make' },
];


function EditorRow(props){
  const [title, setTitle] = useState('');
  const [imgId, setImgId] = useState();
  const [body, setBody] = useState();

  const handleChangeTitle = e => {
    setTitle(e.target.value);
  };

  const handleChangeBody = e => {
    setBody(e.target.value);
  };

  const handleChangeImg = e => {
    setImgId(e.target.value);
  };

  const editSlide = (slideId) =>{
    const slideProp = {
      slideId:String(slideId),
      title:title,
      imgId:imgId,
      body:body
    }
    localStorage.setItem('Slide' + String(slideId), JSON.stringify(slideProp));
  }

  return (
    <div>
            <Paper>
              <Grid container>
                <Grid item xs={1}>
                  Slide # {props.id}
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    type='text'
                    name='Title'
                    value={title}
                    onChange={handleChangeTitle}
                    label='Title'
                    placeholder='WAGMI'
                    fullWidth
                    variant='outlined'
                    autoComplete='off'
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>Img</InputLabel>
                    <Select
                      labelId='demo-simple-select-label'
                      id='demo-simple-select'
                      value={imgId}
                      label='Img'
                      onChange={handleChangeImg}
                    >
                      <MenuItem value={1}>Ten</MenuItem>
                      <MenuItem value={2}>Twenty</MenuItem>
                      <MenuItem value={3}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type='text'
                    name='Body'
                    value={body}
                    onChange={handleChangeBody}
                    label='Body'
                    placeholder='You can do it'
                    fullWidth
                    variant='outlined'
                    autoComplete='off'
                  />
                </Grid>
                <Grid item xs={1}>
                  <Button onClick={()=>{editSlide(props.id)}}><Edit/></Button>
                </Grid>
              </Grid>
            </Paper>
          </div>
        );
}

function Editor() {
  const [slidePages, setSlidePages] = useState([1, 2, 3]);
  const [editorFlag, setEditorFlag] = useState(1);


  const addSlide = () => {
    const t = slidePages.slice();
    t.push(t.length + 1);
    setSlidePages(t);
  };

  const deleteSlide = () => {
    const t = slidePages.slice();
    t.pop();
    setSlidePages(t);
  };


  const showEditor=()=>{
    setEditorFlag(editorFlag*(-1));
  }

  if(editorFlag==1){
    return(
      <div>
        <Button onClick={()=>{showEditor()}} type="button" fullWidth><ExpandMore sx={{fontSize: 40}}/></Button>
        </div>
      );

  }else{
      return(
        <div>
        <Button onClick={()=>{showEditor()}} type="button" fullWidth><ExpandLess sx={{fontSize: 40}}/></Button>
            {slidePages.map(key => {
              return(
                <div key={key}>
                  <EditorRow id={key}/>
                </div>
              )
            })}
            <Button
              onClick={() => {
                addSlide();
              }}
            >
              <AddCircleOutline />
            </Button>
            <Button
              onClick={() => {
                deleteSlide();
              }}
            >
              <RemoveCircleOutline />
            </Button>
          </div>
        );
  }
}

export function PresentationPage() {
  const [pageNum, setPageNum] = useState(slidesProp.length);
  const [page, setPage] = useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const [yourSlides, _setYourSlides] = useState(slidesProp);

  useEffect(()=>{
    //getSlideProp();
  },[]);

  const getSlideProp =()=>{
    const tmp = [];
    for (let i = 0; i < localStorage.length; i++) {
      const keyName = localStorage.key(i);
      if (keyName.indexOf("Slide") !== -1){
        tmp.push(localStorage.getItem(keyName));
      }
    }
    if(tmp.length==0){
      //_setYourSlides([{ title: 'First Slide', imgId:1, body: 'I can do anything ' }])
      setPageNum(1);
    }else{
      _setYourSlides(tmp);
      setPageNum(tmp.length);
    }
    console.log(yourSlides[page-1].title);
  }

  return (
    <div>
      <Box margin={5}>
        <Slide
          title={yourSlides[page-1].title}
          img_url={yourSlides[page-1].img}
          msg={yourSlides[page-1].msg}
        />
      </Box>

      <Grid container alignItems='center' justifyContent='center'>
        <Box>
          <Pagination count={pageNum} page={page} onChange={handleChange} />
        </Box>
      </Grid>
      <Box margin={5}>
        <Editor />
      </Box>
    </div>
  );
}