import { updatePluginSchema } from '@openconductor/api/src/schema/plugin';
import { Plugins } from '@openconductor/db/types';
import FieldError from '~/components/shared/formError';
import { api } from '~/utils/api';
import { useZodForm } from '~/utils/form';

export default function PluginSettings({ pluginId }: { pluginId: string }) {
  const utils = api.useContext();
  const { data: plugin, isLoading } = api.plugin.byId.useQuery({ id: pluginId as string });
  const { data: integrations } = api.integration.all.useQuery();

  const updatePlugin = api.plugin.update.useMutation({
    onSuccess: async () => {
      await utils.plugin.invalidate();
    },
  });

  const { mutate: deletePlugin } = api.plugin.delete.useMutation({
    async onSuccess() {
      await utils.plugin.invalidate();
    },
  });

  const methods = useZodForm({
    //@ts-ignore
    schema: updatePluginSchema,
    values: {
      id: plugin?.id,
      name: plugin?.name,
      type: plugin?.type,
      systemTemplate:
        plugin?.systemTemplate ||
        'The following is a friendly conversation between a human and an AI. The AI is straight-to-the-point and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know. If the user asks for a list, the AI should give the list directly without adding text before or after the list. If appropriate, you can return some or all of your response as Markdown. This includes using appropriate headings, lists, code snippets, Mermaid diagrams, etc.',
      promptTemplate: plugin?.promptTemplate || '{text}',
    },
  });

  if (!pluginId || !plugin || isLoading || !integrations) return <></>;

  return (
    <>
      <form
        onSubmit={methods.handleSubmit(async (values) => {
          console.log('onSubmit', values);
          await updatePlugin.mutateAsync(values);
          methods.reset();
        })}
        className="space-y-2"
      >
        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
          <div>
            <label htmlFor="name" className="plugin text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
              Name
            </label>
          </div>
          <div className="sm:col-span-2">
            <input
              id="name"
              {...methods.register('name')}
              className="plugin w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {methods.formState.errors.name?.message && <FieldError error={methods.formState.errors.name} />}
          </div>
        </div>

        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
          <div>
            <label htmlFor="type" className="plugin text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
              Type
            </label>
          </div>
          <div className="sm:col-span-2">
            <select
              className="plugin w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              {...methods.register('type')}
              onChange={(e) => methods.setValue('select', e.target.value, { shouldValidate: false })} // Using setValue
            >
              <option value="">Choose a type</option>
              {Object.values(Plugins).map((pluginType) => (
                <option key={pluginType} value={pluginType}>
                  {pluginType}
                </option>
              ))}
            </select>
            {methods.formState.errors.type?.message && <FieldError error={methods.formState.errors.type} />}
          </div>
        </div>

        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
          <div>
            <label htmlFor="integration" className="plugin text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
              Integration
            </label>
          </div>
          <div className="sm:col-span-2">
            <select
              className="plugin w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              {...methods.register('integrationId')}
              onChange={(e) => methods.setValue('select', e.target.value, { shouldValidate: true })} // Using setValue
            >
              <option value="">Choose an integration</option>
              {integrations.map((integration) => (
                <option key={integration.id} value={integration.id}>
                  {integration.type}
                </option>
              ))}
            </select>
            {methods.formState.errors.integrationId?.message && (
              <FieldError error={methods.formState.errors.integrationId} />
            )}
          </div>
        </div>

        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
          <div>
            <label htmlFor="systemTemplate" className="plugin text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
              System template
            </label>
          </div>
          <div className="sm:col-span-2">
            <textarea
              id="systemTemplate"
              rows={10}
              {...methods.register('systemTemplate')}
              className="plugin w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {methods.formState.errors.systemTemplate?.message && (
              <FieldError error={methods.formState.errors.systemTemplate} />
            )}
          </div>
        </div>

        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
          <div>
            <label htmlFor="promptTemplate" className="plugin text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
              Prompt template
            </label>
          </div>
          <div className="sm:col-span-2">
            <textarea
              id="promptTemplate"
              rows={10}
              {...methods.register('promptTemplate')}
              className="plugin w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {methods.formState.errors.promptTemplate?.message && (
              <FieldError error={methods.formState.errors.promptTemplate} />
            )}
          </div>
        </div>

        <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => deletePlugin}
            >
              Delete
            </button>
            <button
              type="submit"
              disabled={updatePlugin.isLoading}
              className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
