import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { Word } from '@/types';

interface WordDisplayProps {
  word: Word;
  newWord: () => void;
  reset: () => void;
}

function WordDisplay({
  word,
  newWord,
  reset,
}: WordDisplayProps) {
  return (
    <Card>
      <CardContent>
        {word.track && (
          <CardMedia
            component="img"
            height="140"
            width="140"
            alt={word.track?.name}
            src={word.track?.album?.images[0]?.url || ''}
            sx={{ borderRadius: 1 }}
          />
        )}
        <Typography align="center" variant="h3">
          {word.word}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={() => newWord()}>
          NEW WORD
        </Button>
        <Button onClick={() => reset()}>
          EDIT LIST
        </Button>
      </CardActions>
    </Card>
  );
}

export default WordDisplay;
