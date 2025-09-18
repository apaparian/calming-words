import {
  Avatar,
  Button,
  Card,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { Word } from '@/types';

interface ListItemProps {
  word: Word;
  index: number;
  deleteWord: (i: number) => void;
  linkSong: (i: number) => void;
  deviceId: string | null;
}

function ListItem({
  word,
  index,
  deleteWord,
  linkSong,
  deviceId,
}: ListItemProps) {
  return (
    <Card raised sx={{ margin: 1 }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid size={2}>
          <Avatar
            variant="rounded"
            alt={word.track?.name}
            src={word.track?.album?.images[0]?.url}
          />
        </Grid>
        <Grid size={6}>
          <Typography>{word.word}</Typography>
        </Grid>
        <Grid size={3} display="flex" justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() => linkSong(index)}
            disabled={!deviceId}
          >
            Link Song
          </Button>
        </Grid>
        <Grid size={1} display="flex" justifyContent="flex-end">
          <IconButton
            onClick={() => deleteWord(index)}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Card>
  );
}

export default ListItem;
