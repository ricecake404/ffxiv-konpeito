import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import debounce from "lodash/debounce";

interface AutoCompleteOption {
  key: number;
  label: string;
}

interface AsyncAutocompleteProps {
  onSearch: (query: string) => Promise<AutoCompleteOption[]>;
  onOptionChange: (option?: AutoCompleteOption) => void;
}

const AsyncAutocomplete: React.FC<AsyncAutocompleteProps> = ({
  onSearch,
  onOptionChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<readonly AutoCompleteOption[]>(
    []
  );
  const [loading, setLoading] = React.useState(false);

  const [searchText, setSearchText] = React.useState("");

  const debounceSearch = React.useMemo(
    () =>
      debounce(
        async (searchText: string) => {
          setLoading(true);
          const result: AutoCompleteOption[] = await onSearch(searchText);
          setOptions([...result]);
          setLoading(false);
        },
        500,
        { trailing: true }
      ),
    [onSearch]
  );

  React.useEffect(() => {
    let active = true;

    if (active) {
      debounceSearch(searchText);
    }

    return () => {
      active = false;
    };
  }, [debounceSearch, searchText]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      sx={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(_, option) => {
        onOptionChange(options.find((it) => it.label === option?.label));
      }}
      isOptionEqualToValue={(option, value) => option.key === value.key}
      getOptionLabel={(option) => option.label}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Recipe"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          key={params.id}
        />
      )}
    />
  );
};

export default AsyncAutocomplete;
