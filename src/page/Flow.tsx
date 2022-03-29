import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  ButtonBase,
  Checkbox,
  Container,
  FormControlLabel,
  LinearProgress,
  Stack,
  TextField,
  Tooltip,
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
  Action,
  CraftActionList,
  CraftActionMap,
  CraftingProcessStatus,
  EmptyCraftingProcessStatus,
  initCraftingProcessStatus,
} from "../model/eorzea/action";
import { groupBy, uniq } from "lodash";
import { craft, toHQPercent } from "../model/eorzea/craft";

interface CraftProgressBarProps {
  value: number;
  total: number;
}

interface CraftActionDisplay extends Action {
  iconUrl: string;
  actionId: number;
}

const CraftProgressBar: React.FC<CraftProgressBarProps> = ({
  value,
  total,
}) => {
  const displayValue = Math.min(value, total);
  const calcPercentage = (val: number, total: number) => (val / total) * 100;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress
            variant="determinate"
            value={calcPercentage(displayValue, total)}
          />
        </Box>
        <Box sx={{ minWidth: 70 }}>
          <Typography variant="body2" color="text.secondary">
            {`${displayValue} / ${total}`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

interface ActionButtonProps {
  action: CraftActionDisplay;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ action, onClick }) => {
  return (
    <Tooltip title={action.name.chs} arrow placement="top">
      <ButtonBase onClick={() => onClick && onClick()}>
        <Avatar
          src={action.iconUrl}
          sx={{ width: 40, height: 40 }}
          variant="square"
        />
      </ButtonBase>
    </Tooltip>
  );
};

interface ActionPipelineProps {
  value: CraftActionDisplay[];
  onRemove: (index: number) => void;
}

const ActionPipeline: React.FC<ActionPipelineProps> = ({ value, onRemove }) => {
  return (
    <Stack direction="row">
      {value.map((action, index) => {
        return (
          <Box sx={{ mx: 0.5 }} key={index}>
            <ActionButton action={action} onClick={() => onRemove(index)} />
          </Box>
        );
      })}
    </Stack>
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
  const [CPSList, setCPSList] = React.useState<CraftingProcessStatus[]>([]);

  React.useEffect(() => {
    if (recipe) {
      const initStatus = initCraftingProcessStatus(craftingStatus, recipe);
      setCraftingProcessStatus(initStatus);
      setCPSList([initStatus]);
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
    setClassJobId(8);
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

  const [actionPipeline, setActionPipeline] = React.useState<Action[]>([]);
  const actionPipelineDisplay = React.useMemo<CraftActionDisplay[]>(() => {
    return actionPipeline.map(
      (action) => actions.find((it) => it.id === action.id)!!
    );
  }, [actionPipeline, actions]);

  const handleActionClicked = (actionDisplay: CraftActionDisplay) => {
    if (recipe) {
      const action = CraftActionMap.get(actionDisplay.id)!!;
      setActionPipeline((prev) => prev.concat([action]));
      setCraftingProcessStatus(
        craft(craftingProcessStatus, craftingStatus, recipe, action)
      );
    }
  };

  const handleRemove = (index: number) => {
    const reCalcAll = (actionPipeline: Action[]) => {
      if (recipe) {
        let cps = initCraftingProcessStatus(craftingStatus, recipe);
        setCPSList([cps]);
        for (let action of actionPipeline) {
          cps = craft(cps, craftingStatus, recipe, action);
        }
        setCraftingProcessStatus(cps);
        setCPSList((prev) => prev.concat([cps]));
      }
    };

    let newPipeline = [...actionPipeline];
    newPipeline.splice(index, 1);

    setActionPipeline(newPipeline);
    reCalcAll(newPipeline);
  };

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
              <ActionPipeline
                value={actionPipelineDisplay}
                onRemove={handleRemove}
              />
              <Box>
                <Typography>
                  {`HQ: ${toHQPercent(
                    craftingProcessStatus.quality /
                      craftingProcessStatus.qualityTotal
                  )}%`}
                </Typography>
              </Box>
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
                              <ActionButton
                                action={action}
                                onClick={() => handleActionClicked(action)}
                              />
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
