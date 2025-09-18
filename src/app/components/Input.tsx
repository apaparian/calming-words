import { useState, JSX } from 'react';
import {
  Button,
  Card,
  CardContent,
  TextField,
} from '@mui/material';

interface InputProps {
  addWord: (word: string) => void;
}

function Input({
  addWord,
}: InputProps): JSX.Element {
  const [word, setWord] = useState('');

  return (
    <Card>
      <CardContent>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          onChange={(e) => setWord(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <Button
                  sx={{ p: 0 }}
                  size="large"
                  disabled={!word}
                  onClick={() => addWord(word)}
                >
                  Add
                </Button>
              ),
            },
          }}
        />
      </CardContent>
    </Card>
  );
}

export default Input;
