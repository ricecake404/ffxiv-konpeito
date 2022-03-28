import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AsyncAutocomplete from "../components/basic/AsyncAutocomplete";
import {
  getActions,
  getCraftActions,
  getRecipe,
  HOST,
  search,
} from "../service/xivapiService";
import { Recipe, RecipeId } from "../model/eorzea/recipe";
import {
  CraftingStatus,
  craftingStatusToString,
  EmptyStatus,
  Status,
  toCraftingStatus,
} from "../model/eorzea/status";
import { toRecipe } from "../model/ffxiv-api/recipe";
import {
  CraftAction,
  CraftActionList,
  CraftingProcessStatus,
  EmptyCraftingProcessStatus,
  initCraftingProcessStatus,
} from "../model/eorzea/CraftAction";
import { groupBy, uniq } from "lodash";
import { Image } from "@mui/icons-material";

interface CraftProgressBarProps {
  value: number;
  total: number;
}

interface CraftActionDisplay extends CraftAction {
  iconUrl: string;
  actionId: number;
}

const CraftProgressBar: React.FC<CraftProgressBarProps> = ({
  value,
  total,
}) => {
  const calcPercentage = (val: number, total: number) => (val / total) * 100;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress
            variant="determinate"
            value={calcPercentage(value, total)}
          />
        </Box>
        <Box sx={{ minWidth: 70 }}>
          <Typography variant="body2" color="text.secondary">
            {`${value} / ${total}`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const FishListPage: React.FC = () => {
  const [expanded, setExpanded] = React.useState<string | false>("panel3");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const [recipeId, setRecipeId] = React.useState<RecipeId | undefined>(
    undefined
  );
  const [recipe, setRecipe] = React.useState<Recipe | undefined>();
  React.useEffect(() => {
    if (recipeId) {
      (async () => {
        const r = await getRecipe(recipeId);
        setRecipe(toRecipe(r));
      })();
    }
  }, [recipeId]);

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
  const [craftingProcessStatus, setCraftingProcessStatus] =
    React.useState<CraftingProcessStatus>(EmptyCraftingProcessStatus);
  React.useEffect(() => {
    if (recipe) {
      setCraftingProcessStatus(
        initCraftingProcessStatus(craftingStatus, recipe)
      );
    }
  }, [craftingStatus, recipe]);

  // TODO remove test code
  React.useEffect(() => {
    setRecipeId(1);
    setStatus({
      level: 1,
      craftsmanship: 24,
      control: 0,
      cp: 180,
      specialist: false,
    });
  }, []);

  const statusInputs = React.useMemo(() => {
    return Object.entries(status)
      .map(([statusKey, statusValue]) => {
        if (typeof statusValue === "number") {
          return (
            <TextField
              key={statusKey}
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
              key={statusKey}
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
      .map((it, index) => {
        return (
          <Box key={index} sx={{ my: 1 }}>
            {it}
          </Box>
        );
      });
  }, [status]);

  const [classJobId, setClassJobId] = React.useState<number>(8);
  const [actions, setActions] = React.useState<CraftActionDisplay[]>([]);
  React.useEffect(() => {
    (async () => {
      const [actionsResp, craftActionsResp] = await Promise.all([
        getActions(
          uniq(
            CraftActionList.filter((it) => it.table === "Action").map(
              (it) => it.classJobActions.get(classJobId)!!
            )
          )
        ),
        getCraftActions(
          uniq(
            CraftActionList.filter((it) => it.table === "CraftAction").map(
              (it) => it.classJobActions.get(classJobId)!!
            )
          )
        ),
      ]);
      const resps = actionsResp.Results.concat(craftActionsResp.Results);
      setActions(
        CraftActionList.map((action) => {
          const actionId = action.classJobActions.get(classJobId);
          const _action = resps.find((it) => it.ID === actionId)!!;
          return {
            ...action,
            iconUrl: HOST + _action.IconHD,
            actionId: _action.ID,
          } as CraftActionDisplay;
        })
      );
    })();
  }, [classJobId]);

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
            <Stack direction="row">
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
              <Box>
                <pre>{JSON.stringify(recipe, null, 2)}</pre>
              </Box>
            </Stack>
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
              Actions
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>-</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack>
              <Box>
                <pre>{JSON.stringify(craftingProcessStatus, null, 2)}</pre>
              </Box>
              <CraftProgressBar
                value={craftingProcessStatus.progress}
                total={craftingProcessStatus.progressTotal}
              />
              <CraftProgressBar
                value={craftingProcessStatus.quality}
                total={craftingProcessStatus.qualityTotal}
              />
              <CraftProgressBar
                value={craftingProcessStatus.cp}
                total={craftingProcessStatus.cpTotal}
              />
              <CraftProgressBar
                value={craftingProcessStatus.durability}
                total={craftingProcessStatus.durabilityTotal}
              />
              {/*<Box>{JSON.stringify(actions)}</Box>*/}
              <Box>
                {Object.entries(groupBy(actions, "type")).map(
                  ([type, _actions]) => {
                    return (
                      <Box key={type}>
                        <Typography>{type}</Typography>
                        <Stack direction="row">
                          {_actions.map((action) => (
                            <Box
                              key={action.id}
                              display="flex"
                              flexDirection="column"
                              mx={1}
                            >
                              <Avatar
                                alt="Remy Sharp"
                                src={action.iconUrl}
                                sx={{ width: 40, height: 40 }}
                                variant="square"
                              />
                              {action.name.chs}
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    );
                  }
                )}
              </Box>
            </Stack>
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
