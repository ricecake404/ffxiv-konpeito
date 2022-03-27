import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AsyncAutocomplete from "../components/basic/AsyncAutocomplete";
import { search } from "../service/xivapiService";
import { RecipeId } from "../model/eorzea/recipe";
import {
  CraftingStatus,
  craftingStatusToString,
  EmptyStatus,
  Status,
  toCraftingStatus,
} from "../model/eorzea/status";

const FishListPage: React.FC = () => {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const [recipeId, setRecipeId] = React.useState<RecipeId | undefined>(
    undefined
  );
  const [status, setStatus] = React.useState<Status>(EmptyStatus);
  const setStatusField = (field: keyof Status, value: Status[keyof Status]) =>
    setStatus((prevStatus) => ({
      ...prevStatus,
      [field]: value,
    }));
  const craftingStatus = React.useMemo<CraftingStatus>(
    () => toCraftingStatus(status),
    [status]
  );

  // TODO remove test code
  React.useEffect(() => {
    setRecipeId(1);
    setStatus({
      level: 1,
      craftsmanship: 24,
      control: 0,
      cp: 180,
      professional: false,
    });
  }, []);

  const statusInputs = React.useMemo(() => {
    return Object.entries(status)
      .map(([statusKey, statusValue]) => {
        if (typeof statusValue === "number") {
          return (
            <TextField
              label={statusKey}
              value={statusValue}
              type="number"
              onChange={(e) =>
                setStatusField(statusKey as keyof Status, +e.target.value)
              }
            />
          );
        } else if (typeof statusValue === "boolean") {
          return (
            <FormControlLabel
              label={statusKey}
              control={
                <Checkbox
                  checked={statusValue}
                  onChange={(e) =>
                    setStatusField(statusKey as keyof Status, e.target.checked)
                  }
                />
              }
            />
          );
        } else {
          throw Error("value not supported");
        }
      })
      .map((it) => {
        return <Box sx={{ my: 1 }}>{it}</Box>;
      });
  }, [status]);

  return (
    <>
      <Container sx={{ py: 1 }}>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ width: "33%", flexShrink: 0 }}>Item</Typography>
            <Typography sx={{ color: "text.secondary" }}>
              RecipeId: {recipeId}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <AsyncAutocomplete
              onSearch={async (searchText) => {
                const result = await search(searchText, "recipe");
                return result.Results.map((it) => ({
                  key: it.ID,
                  label: it.Name,
                }));
              }}
              onOptionChange={(option) => setRecipeId(option?.key)}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography sx={{ width: "33%", flexShrink: 0 }}>
              Worker of Light
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Status: {craftingStatusToString(craftingStatus)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack>{statusInputs}</Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3bh-content"
            id="panel3bh-header"
          >
            <Typography sx={{ width: "33%", flexShrink: 0 }}>
              Advanced settings
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Filtering has been entirely disabled for whole web server
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer
              sit amet egestas eros, vitae egestas augue. Duis vel est augue.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel4"}
          onChange={handleChange("panel4")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4bh-content"
            id="panel4bh-header"
          >
            <Typography sx={{ width: "33%", flexShrink: 0 }}>
              Personal data
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer
              sit amet egestas eros, vitae egestas augue. Duis vel est augue.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Container>
    </>
  );
};

export default FishListPage;
