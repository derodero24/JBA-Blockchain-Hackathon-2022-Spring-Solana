import { useState } from 'react';

import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
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

import nft1_img from '../../img/test1.png';
import nft2_img from '../../img/test2.png';
import nft3_img from '../../img/test3.png';
import Slide from '../components/Slide';

const slidesProp = [
  {},
  { title: 'First Slide', img: nft1_img, msg: 'I can do anything ' },
  { title: 'Second Slide', img: nft2_img, msg: 'I can do anything ' },
  { title: 'Third Slide', img: nft3_img, msg: 'I can do anything ' },
];

function Editor() {
  const [slidePages, setSlidePages] = useState([1, 2, 3]);
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

  return (
    <div>
      {slidePages.map(key => {
        return (
          <div key={key}>
            <Paper>
              <Grid container>
                <Grid item xs={1}>
                  Slide #{key}
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
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={7}>
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
              </Grid>
            </Paper>
          </div>
        );
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

export function PresentationPage() {
  const pageNum = slidesProp.length - 1;
  const [page, setPage] = useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const [yourSlides, _setYourSlides] = useState(slidesProp);

  return (
    <div>
      <Box margin={5}>
        <Slide
          title={yourSlides[page].title}
          img_url={yourSlides[page].img}
          msg={yourSlides[page].msg}
        />
      </Box>

      <Grid container alignItems='center' justifyContent='center'>
        <Box>
          <Pagination count={pageNum} page={page} onChange={handleChange} />
        </Box>
      </Grid>
      <Editor />
    </div>
  );
}
