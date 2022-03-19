import _ from 'lodash';
import { ChangeEvent, useState } from 'react';

import { AddCircleOutline, ExpandLess, ExpandMore, RemoveCircleOutline } from '@mui/icons-material';
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
  SelectChangeEvent,
  TextField,
} from '@mui/material';

import Slide from '../components/Slide';

type SlideProp = {
  title: string;
  img: string;
  msg: string;
};

function EditorRow(props: {
  idx: number;
  slideProps: SlideProp[];
  setSlidesProps: React.Dispatch<React.SetStateAction<SlideProp[]>>;
}) {
  const slideProp = props.slideProps[props.idx];

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    props.setSlidesProps(prev => {
      const newVal = _.cloneDeep(prev);
      newVal[props.idx].title = e.target.value;
      return newVal;
    });
  };

  const handleChangeBody = (e: ChangeEvent<HTMLInputElement>) => {
    props.setSlidesProps(prev => {
      const newVal = _.cloneDeep(prev);
      newVal[props.idx].msg = e.target.value;
      return newVal;
    });
  };

  const handleChangeImg = (e: SelectChangeEvent<string>) => {
    props.setSlidesProps(prev => {
      const newVal = _.cloneDeep(prev);
      newVal[props.idx].img = e.target.value;
      return newVal;
    });
  };

  return (
    <div>
      <Paper>
        <Grid container>
          <Grid item xs={1}>
            Slide # {props.idx}
          </Grid>
          <Grid item xs={2}>
            <TextField
              type='text'
              name='Title'
              value={slideProp.title}
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
                value={slideProp.img}
                label='Img'
                onChange={handleChangeImg}
              >
                <MenuItem
                  value={'https://ipfs.io/ipfs/QmaYSTTQQLQZJTFdQAHPggKALuk7WYcu3zSYDazVZBgWs1'}
                >
                  Dush #0001
                </MenuItem>
                <MenuItem
                  value={'https://ipfs.io/ipfs/QmeAP2RBjug2aVLHhk99nKJDxa7RPyBFG4mf59VmUoyZ5h'}
                >
                  Hibee #0004
                </MenuItem>
                <MenuItem
                  value={'https://ipfs.io/ipfs/QmQdQUqRqbm5hHexhuBa26pw5wAYkzf2rL76si6WM7Eo28'}
                >
                  Hist #00023
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              type='text'
              name='Body'
              value={slideProp.msg}
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
}

function Editor(props: {
  slideProps: SlideProp[];
  setSlidesProps: React.Dispatch<React.SetStateAction<SlideProp[]>>;
}) {
  const [editorFlag, setEditorFlag] = useState(false);

  const addSlide = () => {
    props.setSlidesProps(prev => {
      const newVal = _.cloneDeep(prev);
      newVal.push({
        title: 'First Slide',
        img: 'https://ipfs.io/ipfs/QmaYSTTQQLQZJTFdQAHPggKALuk7WYcu3zSYDazVZBgWs1',
        msg: 'We are gonna make',
      });
      return newVal;
    });
  };

  const deleteSlide = () => {
    props.setSlidesProps(prev => {
      const newVal = _.cloneDeep(prev);
      if (newVal.length > 1) {
        return newVal.slice(0, prev.length - 1);
      }
      return newVal;
    });
  };

  const showEditor = () => {
    setEditorFlag(prev => !prev);
  };

  if (editorFlag) {
    return (
      <div>
        <Button
          onClick={() => {
            showEditor();
          }}
          type='button'
          fullWidth
        >
          <ExpandLess sx={{ fontSize: 40 }} />
        </Button>
        {props.slideProps.map((_slideProp, idx) => {
          return (
            <div key={idx}>
              <EditorRow
                idx={idx}
                slideProps={props.slideProps}
                setSlidesProps={props.setSlidesProps}
              />
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
  } else {
    return (
      <div>
        <Button
          onClick={() => {
            showEditor();
          }}
          type='button'
          fullWidth
        >
          <ExpandMore sx={{ fontSize: 40 }} />
        </Button>
      </div>
    );
  }
}

export function PresentationPage() {
  const [slidesProps, setSlidesProps] = useState<SlideProp[]>([
    {
      title: 'First Slide',
      img: 'https://ipfs.io/ipfs/QmaYSTTQQLQZJTFdQAHPggKALuk7WYcu3zSYDazVZBgWs1',
      msg: 'We are gonna make',
    },
  ]);
  const [pageIdx, setPageIdx] = useState(1);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageIdx(value);
  };

  return (
    <div>
      <Box margin={5}>
        <Slide
          title={slidesProps[pageIdx - 1].title}
          img_url={slidesProps[pageIdx - 1].img}
          msg={slidesProps[pageIdx - 1].msg}
        />
      </Box>

      <Grid container alignItems='center' justifyContent='center'>
        <Box>
          <Pagination count={slidesProps.length} page={pageIdx} onChange={handleChange} />
        </Box>
      </Grid>
      <Box margin={5}>
        <Editor slideProps={slidesProps} setSlidesProps={setSlidesProps} />
      </Box>
    </div>
  );
}
